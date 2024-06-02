let currentRoute = "";
let listeners = [];

export const setCurrentRoute = (route) => {
  currentRoute = route;
  listeners.forEach((listener) => listener(route));
};

export const getCurrentRoute = () => currentRoute;

export const subscribeToRouteChange = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};
