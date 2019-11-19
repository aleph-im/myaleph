import { LocalStorage, SessionStorage } from 'quasar'

export default async ({ app /* app, router, Vue, ... */ }) => {
  let account = LocalStorage.getItem('account')
  if (account&&(account!='null')) {
    app.store.commit('set_account', account)
  }
}
