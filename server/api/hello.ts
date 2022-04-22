export default defineEventHandler((event) => {
    const query = useQuery(event)
    console.log(query)
    return {
      api: 'works'
    }
  })