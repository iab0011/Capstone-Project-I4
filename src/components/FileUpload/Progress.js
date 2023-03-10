import React from 'react'
import { PropTypes } from 'prop-types'

// Bootstrap for progress bar that displays the percentages accordingly
const Progress = ({ percentage }) => {
    return (
        <div className="progress">
            <div className="progress-bar" 
                role="progressbar" 
                style={{ width: `${percentage}%`}}
            >
            {percentage}%
            </div>
        </div>
    )
}

Progress.propTypes = {
    percentage: PropTypes.number.isRequired
}

export default Progress