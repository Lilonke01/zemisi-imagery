export function validateReview(body:unknown){
 if(!body||typeof body!=='object')return null;
 const {name,experience,rating}=body as Record<string,unknown>;
 if(typeof name!=='string'||name.trim().length<1||name.trim().length>120||typeof experience!=='string'||experience.trim().length<10||experience.trim().length>3000||typeof rating!=='number'||!Number.isInteger(rating)||rating<1||rating>5)return null;
 return {name:name.trim(),experience:experience.trim(),rating};
}
