export async function getPosts(url: string, subforumId: number){
    const response = await fetch(`${url}/api/subforums/${subforumId}/posts`);
    if(!response.ok) throw new Error(`Failure trying to get ${subforumId} subforums posts`);
    return response.json();
}