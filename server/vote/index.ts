// var getRawBody = require('raw-body');
// var getFormBody = require('body/form');
// var body = require('body');
import { MongoClient } from 'mongodb';
import { v4 } from 'uuid';
import { DoVoteOptions, VoteTopic } from '../../shared/vote';
import { defineHandler, defineRawHandler } from './utils';

/*
To enable the initializer feature (https://help.aliyun.com/document_detail/156876.html)
please implement the initializer function as below：
exports.initializer = (context, callback) => {
  console.log('initializing');
  callback(null, '');
};
*/

export interface VoteTopicChoice {
    id: string
    name: string
    voteCount: number
}

export interface VoteTopicRecord {
    _id: string
    title: string
    author: string
    choices: Array<VoteTopicChoice>
    likedCount: number
    savedCount: number
    single: boolean
}

export interface VoteUserLikeRecord {
    _id: string
    username: string
    topicId: string
}

export interface VoteUserSaveRecord {
    _id: string
    username: string
    topicId: string
}

export interface VoteHistoryRecord {
    _id: string
    username: string
    date: string
    topicId: string
    choiceId: string
}

export interface CreateVoteOptions {
    choices: string[];
    single: boolean;
    title: string;
}

export interface DeleteVoteOption{
    id: string;
}

process.on('unhandledRejection', (e) => {
    console.log(e)
})

export const vote = defineHandler(async (context, req) => {
    switch (req.method) {
        case 'OPTIONS':
            return {}
        case 'GET':
            return readVotes(context, req)
        case 'POST':
            return addVote(context, req)
        case 'PUT':
            return doVote(context, req)
        case 'DELETE':
            return deleteVote(context, req)
        default:
            throw new Error('Unimplemented')
    }
})
const deleteVote = defineRawHandler(async(context, req)=>{
    const client = new MongoClient(process.env.MONGO!, { ssl: true, tls: true })
    const logger = context.log

    const body: DeleteVoteOption = await JSON.parse(req.rawBody)
    logger.info(body)

    const username = req.headers.username
    logger.info(username)

    try {
        await client.connect()
    } catch (e) {
        return { error: e, type: 'dbconnection' }
    }
    logger.info('db')
    const db = client.db('test')
    const votes = db.collection<VoteTopicRecord>('votes')
    const target = await votes.findOne({ _id: body.id })
    logger.info(`found vote ${JSON.stringify(target)}`)
    logger.info(username)

    
    if (username===target?.author){
        votes.deleteOne({"_id" : target._id})
        // try {
        //     votes.deleteOne("_id" : JSON.stringify(target._id))
        //  } catch (e) {
        //     print(e);
        //  }
    }
})



const addVote = defineRawHandler(async (context, req) => {
    const client = new MongoClient(process.env.MONGO!, { ssl: true, tls: true })
    const logger = context.log

    const body: CreateVoteOptions = await JSON.parse(req.rawBody)
    logger.info(body)

    const username = req.headers.username
    logger.info(username)

    try {
        await client.connect()
    } catch (e) {
        return { error: e, type: 'dbconnection' }
    }
    logger.info('db')
    const db = client.db('test')
    const votes = db.collection<VoteTopicRecord>('votes')

    const voteContents: VoteTopicRecord = {
        _id: v4(),
        title: body.title,
        author: username,
        choices: body.choices.map(name => ({
            id: v4(),
            name: name,
            voteCount: 0
        })),
        single: body.single,
        likedCount: 0,
        savedCount: 0,
    }
    logger.info(voteContents)
    await votes.insertOne(voteContents)
})

const readVotes = defineRawHandler(async (context, req) => {
    const client = new MongoClient(process.env.MONGO!)
    const username = req.headers.username || "Anonymous"
    const logger = context.log

    logger.info('read votes')

    try {
        await client.connect()
    } catch (e) {
        return { error: e, type: 'dbconnection' }
    }

    logger.info('read votes: connected')

    const db = client.db('test')
    const votes = db.collection<VoteTopicRecord>('votes')

    const likes = db.collection<VoteUserLikeRecord>('votes-like')
    const saves = db.collection<VoteUserSaveRecord>('votes-save')
    const history = db.collection<VoteHistoryRecord>('votes-history')

    const topics = await votes.find().limit(20).toArray()
    const result: VoteTopic[] = topics.map(t => ({
        avatar: '',
        id: t._id,
        author: t.author,
        title: t.title,
        liked: false,
        saved: false,
        single: t.single,
        choices: t.choices.map((v) => ({ name: v.name, voteCount: v.voteCount, voted: false, id: v.id }))
    }))

    await likes.find({
        username: username,
        topicId: {
            $in: topics.map(r => r._id)
        },
    }).forEach((doc) => {
        result.find(v => v.id === doc.topicId)!.liked = true
    })
    await saves.find({
        username: username,
        topicId: {
            $in: topics.map(r => r._id)
        },
    }).forEach((e) => {
        result.find(t => t.id === e._id)!.saved = true
    })
    await history.find({
        username,
        topicId: {
            $in: topics.map(r => r._id)
        }
    }).forEach((history) => {
        result.find(t => t.id === history.topicId)!.choices.find(c => c.id === history.choiceId)!.voted = true
    })

    logger.info('read votes: return ' + result.length +  ' results')

    return result
})

const doVote = defineRawHandler(async (context, req) => {
    const client = new MongoClient(process.env.MONGO!)
    const logger = context.log

    const body: DoVoteOptions = JSON.parse(req.rawBody)
    logger.info(body)

    const username = req.headers.username || "Anonymous"
    logger.info(username)

    await client.connect()

    const db = client.db('test')
    const history = db.collection<VoteHistoryRecord>('votes-history')

    const votes = db.collection<VoteTopicRecord>('votes')
    const topic = await votes.findOne({ _id: body.voteTopicId })
    logger.info(`found vote ${topic}`)
    if (topic) {
        const hist = await history.findOne({ topicId: body.voteTopicId, choiceId: body.voteChoiceId, username })
        const choice = topic.choices.find(e => e.id === body.voteChoiceId)
        if (hist) {
            logger.info(hist)
            return { voteCount: choice!.voteCount }
        } else {
            choice!.voteCount += 1
            await votes.updateOne({ _id: body.voteTopicId }, { $set: topic })
            await history.insertOne({ _id: v4(), topicId: body.voteTopicId, choiceId: body.voteChoiceId, date: "", username })
            return { voteCount: choice!.voteCount }
        }
    }

    throw new Error('Do Vote Failed')
})
