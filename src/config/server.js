const getServerConfig = () => ({
  socketPort: process.env.SOCKET_PORT || 5000,
  apiPort: process.env.API_PORT || 3001
})
export default getServerConfig