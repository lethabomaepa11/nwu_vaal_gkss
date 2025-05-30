// 📢 This endpoint is PUBLIC – used for leaderboard display
// Do NOT add authentication here unless the frontend changes



import { json } from '@sveltejs/kit'

export const GET = async ({locals: {supabase}}) => {
    const {data: Member} = await supabase.from("Member").select("name, surname, username, image, points, Topic(id),Project(id)");
    let members = [];
    for(const member of Member){
        let publicUrl = await supabase.storage.from("files").getPublicUrl(member.image.substring(member.image.indexOf("/")+1));//removing the first "file/"
        members.push({...member,image: publicUrl.data.publicUrl});
    }
    /**PROJECTS */
    const {data: Project} = await supabase.from("Project").select("name,description,link,created_at,id,type,Member(username,name,surname),project_views(id)").order('created_at', { ascending: false });
    let projects = [];
    for(const project of Project){
        const {data: Project_rating} = await supabase.from("Project_rating").select("rating,Member(id)").eq("project_id",project.id);
        let rating = Project_rating;
        projects.push({...project,rating: rating})
    }


    return json({success: true,members,projects});
}

