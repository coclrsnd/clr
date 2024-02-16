export { LOGIN_GRAPHQL , USER_BY_ID};

const LOGIN_GRAPHQL = `query ValidateUser($loginInfo: LoginRequestInput!) {
  login(loginRequestInput: $loginInfo) {
    userName
    emailId
    token
    organizationId
    logoPath
    roleId
    roleName
    currentRole
    name
    userId
  }
}
`;



const USER_BY_ID =`query GetUserById($id: Int) {
  users(where: { id: { eq: $id } }) {
    nodes {
      userName
      identityUserId
    }
  }
}
`
