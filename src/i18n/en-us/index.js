// This is just an example,
// so you can safely delete all default props below
const en = {
  public: {
    wallet: 'Wallet',
    wallets: 'Wallets',
    warning: 'Warning',
    amounts: 'Amounts',
    balance: 'Balance',
    balances: 'Balances',
    accounts: 'Accounts',
    total_balance: 'Total Balance',
    usable: 'Usable',
    available: 'Available',
    price: 'Price',
    staked: 'Staked',
    available_balance: 'Available Balance',
    consensus_locked_balance: 'Consensus Locked Balance',
    time_locked_balance: 'Time Locked Balance',
    time_locked: 'Time Locked',
    including_locked: '(incl. locked)'
  },

  resource: {
    keystore_file: "Keystore File",
    encrypted_private_key: "Encrypted Private Key",
    mnemonics_words: "Mnemonic words",
    private_key: "Private Key",
    public_key: "Public Key",
    address: "Address",
    passphrase: "Passphrase",

    account_type_unsure: "Account type (if unsure, leave default)",

    actions: "Actions",

    amount: "Amount",
    validation_min_amount: "Please enter an amount above {min}.",
    valid_amount: "Valid amount requested: {amount}",
    insuficient_balance: "Available balance ({balance}) too low",
    available_balance: "Available balance:",
    remark: "Remark",
    valid_target: "Target seems valid",
    invalid_target: "Invalid Target",
    signed_transaction: "Signed Transaction",
    transaction_content: "Transaction Content",
    unsigned_raw_transaction: "Unsigned Raw Transaction",
    fee: "Fee",
    account_name: 'Account Name',

    max_amount: 'Maximum amount:'
  },

  nav: {
    select: 'Select account',
    all: 'All',
    dashboard: 'Dashboard',
    accounts:'Accounts',
    actions:'Actions',
    addAccount:'Add an account',
    createAccount:'Create an account',
    configuredWallets: 'Configured Wallets'
  },

  header: {
    lastBlock: 'Last Block'
  },

  actions: {
    send: 'Send',
    request: 'Request',
    consolidate: 'Consolidate',
    rename: 'Rename',
    delete: 'Delete',
    backup: 'Backup',
    stake: 'Stake',
    regenerate: 'Re-generate',
    add_it: 'Add it',
    login: 'Log-In',
    logout: 'Log-Out',

    sign_transaction: 'Sign Transaction',
    broadcast_transaction: 'Broadcast Transaction',
    view_detail: 'view detail',
    save: 'Save'
  },

  wallet: {
    wallet_value: 'Wallet Value',
    unspent_outputs: 'Unspent Outputs',
    current_staking: 'Current Staking'
  },

  create: {
    new_text: `
  This is a new private key, just generated for you.
  Please write it down, this is **important**.
  Without it, no way to access your content.
    `,
    import_text: `
  Enter your private key to access your account.
    `,
  import_encrypted_text: `
  Enter your encrypted private key and corresponding password to access your account.
  The resulting address should correspond to the one you are willing to import.
    `,
  import_keystore_text: `
  Please upload your keystore file to import your account.
    `,
    heading: "Add new account",
    create: "Create new account",
    import_mnemonics: "Login by mnemonics",
    import_privkey: "Login by private key",
    import_encrypted_privkey: "Login by encrypted key",
    import_keystore: "Login by keystore",
    add_view_only: "Add view-only account"
  },

  info: {
    date: 'Date',
    source: 'Source',
    target: 'Target',
    value: 'Value',
    fee: 'Fee'
  },

  transfer: {
    target_address: 'Target address'
  }
};
export default en