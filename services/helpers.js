const compareCommentsSize = (a, b) => {
  if (a.kids && b.kids) {
    return b.kids.length - a.kids.length;
  }
  return 1;
};

const getUserAge = (createdAt) => {
  const currentUnixTime = (Date.now() / 1000);
  const userAge = Math.floor((currentUnixTime - createdAt) / (60 * 60 * 24 * 365));
  return userAge;
};
module.exports = { compareCommentsSize, getUserAge };
