const compareCommentsSize = (a, b) => {
  if (a.kids && b.kids) {
    return b.kids.length - a.kids.length;
  }
  return 1;
};

module.exports = { compareCommentsSize };
