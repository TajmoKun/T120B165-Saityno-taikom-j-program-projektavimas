export async function getSubforums(url: string){
const response = await fetch(`${url}/api/subforums`);
if(!response.ok) throw new Error('Failure while fetching subforums');
return response.json();

}
