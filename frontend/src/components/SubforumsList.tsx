import React, { useEffect, useState } from "react";
import { getSubforums } from "../api/subforums";
import { useGlobal } from "../context/GlobalContext";
import "./Subforums.css";

type SubforumListProps = {
  onSelect: (id: number) => void;
};

export function SubForumsList({onSelect}: SubforumListProps){
    const [subForums, setSubForums] = useState<any[]>([]);
    const { host } = useGlobal();

  useEffect(() => {
    getSubforums(host)
      .then(data => setSubForums(data));
  }, [host]);

  return (
    <div className ="subforums-container">
      <h1 className="subforums-title">SubForums</h1>
      <ul className="subforums-list">
        {subForums.map((item) => (
          <li className="subforums-item" key={item.id}>
            <button className="subforums-button" onClick={()=> onSelect(item.id)}>{item.title}</button>
          </li>
        ))}
      </ul>
    </div>
);
}