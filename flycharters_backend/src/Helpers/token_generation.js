export function token_Generation(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token='';
    for(let i=0;i<6;i++){
        const randomIndex=Math.floor(Math.random()*characters.length);
        token+=characters[randomIndex]
    }
    return token;
}