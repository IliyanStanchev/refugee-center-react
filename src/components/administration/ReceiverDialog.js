import React, { useState, useEffect } from "react";
import GroupDialog from './GroupDialog';
import UserInfo from './UserInfo';

const ReceiverDialog = (props) => {

    const { receiver, open, onClose } = props;

    return (
        <div>
            {receiver && receiver.isUser ? (<UserInfo user={receiver && receiver.user} open={open} onClose={() => onClose()} />)
                : (<GroupDialog selectedGroup={receiver && receiver.group} open={open} onActionPerformed={() => onClose()} readOnly={true} />)}
        </div>
    );

}

export default ReceiverDialog;