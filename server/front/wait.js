export default async timeInMs =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), timeInMs);
  });
