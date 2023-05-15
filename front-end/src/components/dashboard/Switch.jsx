import { Form, OverlayTrigger, Tooltip } from "react-bootstrap"

const Switch = ({id, valueChecked, dispatch, updateStatus, tooltipContent}) => {

  return (
    <OverlayTrigger
      placement='top'
      overlay={
        <Tooltip>
          {tooltipContent}
        </Tooltip>
      }
    >
      <Form>
        <Form.Check
          type='switch'
          id='custom-switch'
          onChange={() => updateStatus(id, valueChecked, dispatch)}
          checked={valueChecked}
        />
      </Form>
    </OverlayTrigger>
  )
}

export default Switch