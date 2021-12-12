
export interface VoteChoice {
    id:string;
    name: string;
    voteCount: number;
    voted: boolean;
}

export interface VoteTopic {
    avatar: string;
    author: string;
    title: string;
    choices: VoteChoice[];
    saved: boolean;
    liked: boolean;
    single: boolean;
    id: string;
}

export interface VoteCreationOptions {
    title: string;
    choices: string[];
    single: boolean;
}
