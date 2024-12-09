const socket = new WebSocket(`ws://${window.location.hostname}:7800/ws/`);

const logSocketEvent = (event, message) =>
  //console.log(`WebSocket ${event}: ${message}`);

  (socket.onopen = () => logSocketEvent("is connected", socket));
socket.onerror = (error) => logSocketEvent("error", error);
socket.onclose = (event) => logSocketEvent("is closed with event", event);

export const sendSocketMessage = (message) => {
  const send = () => socket.send(JSON.stringify(message));
  socket.readyState === WebSocket.OPEN
    ? send()
    : socket.addEventListener("open", send);
};

export default socket;
