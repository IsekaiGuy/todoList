exports.getDate = function() {
    const today = new Date;
    const currentDay = today.toLocaleString("default", { weekday: "long", day: "numeric" });   
    
    return currentDay;
}

