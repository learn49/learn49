const checkPermissions = async (db, user_id, account_id) => {
    const [userRole] = await db('user_roles')
        .where({
            user_id
        })
        .andWhere({
            account_id
        })
        .select('*');

    if (userRole.role !== 'owner') {
        throw new Error('Only owner can make this action.');
    }
    return;
};

export { checkPermissions };
