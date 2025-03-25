function checkSchetsEquality(childs) {
    const firstSchet = childs[0].schet;
    return childs.every(child => child.schet === firstSchet);
}


module.exports = { checkSchetsEquality }
