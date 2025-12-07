import {useState,useEffect} from "react";
import {useGlobal} from "../context/GlobalContext";
import {getComments} from "../api/comments";
import "./Comments.css";

type CommentProps = {
    postId : number;
    subforumId: number
}

export function CommentsList({postId,subforumId}: CommentProps) {

    const[comments,setComments] = useState<any[]>([]);
    const {host} = useGlobal();

    useEffect(()=>{ 
        getComments(host,subforumId,postId).then(data => setComments(data)); 
    },[host,subforumId,postId]);
    return(
        <div className="comments-container">
            <h1 className="comments-title">Comments</h1>
            <ul className="comments-list">
                {(comments?? []).map((item)=>(
                    <li className="comments-item" key={item.id}>{item.content}</li>
                ))}
            </ul>
        </div>
    );
}