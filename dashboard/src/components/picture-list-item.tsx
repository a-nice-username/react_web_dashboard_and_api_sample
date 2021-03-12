type PictureListItemPropsType = {
  id: string,
  url: string,
  created_at: string,
  title: string,
  owner_id: string,
  isHideCheckBox: boolean,
  isChecked: boolean,
  onIsCheckedChange: () => void,
  isTheMainRow?: boolean
}

function PictureListItem(props: PictureListItemPropsType) {
  return (
    <>
      <div
        className = 'picture_list_item_container'
        key = {props.id}
        style = {{
          fontWeight: props.isTheMainRow ? 'bold' : 'normal'
        }}
      >
        <div
          className = 'picture_list_checkbox_container'
        >
          <input
            checked = {props.isChecked}
            onChange = {props.onIsCheckedChange}
            type = 'checkbox'
            style = {{
              display: props.isHideCheckBox ? 'none' : 'block'
            }}
          />
        </div>

        <div
          className = 'picture_list_item_id_container'
        >
          {props.id}
        </div>

        <div
          className = 'picture_list_item_picture_container'
        >
          {
            props.url.includes('http') ?
              <a
                href = {props.url}
                target = '_blank'
              >
                <img
                  className = 'picture_list_item_picture'
                  src = {props.url}
                />
              </a>
              :
              props.url
          }
        </div>

        <div
          className = 'picture_list_item_title_container'
        >
          {props.title}
        </div>

        <div
          className = 'picture_list_item_owner_id_container'
        >
          {props.owner_id}
        </div>

        <div
          className = 'picture_list_item_created_at_container'
        >
          {props.created_at}
        </div>
      </div>
    </>
  )
}

export default PictureListItem