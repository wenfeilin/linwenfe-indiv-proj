function Message() {
  const name = "Wenfei";

  if (name) {
    return <p>Hi, {name}.</p>;
  }

  return <p>Hi, there.</p>;
}

export default Message;
