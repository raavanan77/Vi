//import {useQuery, gql , ApolloClient, ApolloCache, InMemoryCache} from '@apollo/client';
//
//let graphql_API_URL = `http://${process.env.DJANGO_SERVER_URL}:${process.env.DJANGO_SERVER_PORT}/graphql`;
//
//const client = new ApolloClient({
//    uri : graphql_API_URL,
//    cache : new InMemoryCache(),
//});
//
//const getTestcase = async () => {
//const TestCase = gql`
//query TestcaseQuery {
//  allTestcase {
//    description
//    testcasename
//    testplatform
//    testarea
//  }
//}
//`;
//
//const {loading, error , data} = useQuery(TestCase);
//
//console.log("Graphql called",data)
//
//}
//
//export {getTestcase};