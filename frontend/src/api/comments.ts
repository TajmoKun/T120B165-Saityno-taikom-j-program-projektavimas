export async function getComments(url: string,subforumId: number, postId: number){
    const response = await fetch(`${url}/api/subforums/${subforumId}/${postId}/comments`)
    if(!response.ok) throw new Error("failure when fetching comments");
    return response.json();
}