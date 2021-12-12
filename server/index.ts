// var getRawBody = require('raw-body');
// var getFormBody = require('body/form');
// var body = require('body');
import { MongoClient } from 'mongodb';
import { v4 } from 'uuid';
import { defineHandler, readJsonBody } from './utils';
import { VoteTopic } from '../shared/vote'
import { IncomingMessage } from 'http'


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

process.on('unhandledRejection', (e) => {
    console.log(e)
})

export const putVote = defineHandler(async (req, res, context) => {
    const client = new MongoClient(process.env.MONGO!)

    const body: CreateVoteOptions = await readJsonBody(req)
    console.log(body)

    const username = req.headers.username || "Anonymous"
    console.log(username)

    try {
        await client.connect()
    } catch (e) {
        return { error: e, type: 'dbconnection' }
    }
    console.log('db')
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
    console.log(voteContents)
    await votes.insertOne(voteContents)
})

export const readVotes = defineHandler(async (req, res, context) => {
    const client = new MongoClient(process.env.MONGO!)

    const username = req.headers.username || "Anonymous"

    try {
        await client.connect()
    } catch (e) {
        return { error: e, type: 'dbconnection' }
    }

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
    
    return result
})
