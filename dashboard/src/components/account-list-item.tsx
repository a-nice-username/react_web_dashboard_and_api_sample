type AccountListItemPropsType = {
  id: string,
  username: string,
  created_at: string,
  role: string,
  isTheMainRow?: boolean
}

function AccountListItem(props: AccountListItemPropsType) {
  return (
    <>
      <div
        className = 'account_list_item_container'
        key = {props.id}
        style = {{
          fontWeight: props.isTheMainRow ? 'bold' : 'normal'
        }}
      >
        <div
          className = 'account_list_item_id_container'
        >
          {props.id}
        </div>

        <div
          className = 'account_list_item_username_container'
        >
          {props.username}
        </div>

        <div
          className = 'account_list_item_role_container'
        >
          {props.role}
        </div>

        <div
          className = 'account_list_item_created_at_container'
        >
          {props.created_at}
        </div>
      </div>
    </>
  )
}

export default AccountListItem