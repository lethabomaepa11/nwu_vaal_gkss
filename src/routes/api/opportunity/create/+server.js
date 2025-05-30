import { json } from '@sveltejs/kit';

export const POST = async({locals: {supabase},request}) => {

    const {data: {user}} = await supabase.auth.getUser();
    if(user){
        const {opportunity} = await request.json();
        const {data,error} = await supabase.from("Opportunity").insert({
            title: opportunity.title,
            type: opportunity.type,
            content: opportunity.content,
            organization: opportunity.organization,
            deadline: opportunity.deadline,
            user_id: user.id,
        })

        if(error){
            return json({success: false,error});
        }
        else{
            //award the member with 20 points
            const {data: Member} = await supabase.from("Member").select("points").eq("id",user.id);
            let newPts = Number(Member[0].points) + 50;
            await supabase.from("Member").update({points: newPts}).eq("id",user.id);
            return json({success: true, newPts});
        }
    }else{
        return json({success: false,error: "User not authenticated"});
    }
}