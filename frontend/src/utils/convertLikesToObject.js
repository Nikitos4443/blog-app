export function convertLikesToObject(likes) {
    const result = {};

    likes.forEach(like => {

        if (!result[like.postId]) {

            result[like.postId] = []
        }

        result[like.postId].push(like.authorId);
    })

    return result;
}