import Cookie from 'js-cookie'

const setCookie = (cksName, responseData) => {
    Cookie.set(cksName, responseData, {
        expires: 1,
        secure: true,
        sameSite: "strict",
        path: '/'
    })
}

export default setCookie;