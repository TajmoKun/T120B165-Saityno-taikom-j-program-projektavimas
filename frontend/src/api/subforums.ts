export async function getSubforums(host: string){
const response = await fetch(`${host}/api/subforums`);
if(!response.ok) throw new Error('Failure while fetching subforums');
return response.json();

}
