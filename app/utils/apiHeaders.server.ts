const API_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
}

function createApiHeaders(request: Request) {
  const url = new URL(request.url)
  const headers = url.pathname.startsWith('/api/') ? API_HEADERS : {}
  return headers
}

export default createApiHeaders
