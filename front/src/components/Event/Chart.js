import React from 'react';
import {Doughnut} from 'react-chartjs-2'
import {useSelector} from "react-redux";

const Chart = props => {

    const colors = useSelector(state => state.event.colors);

    return (
        <div>
            <Doughnut
                data={{
                    labels: props.labels,
                    datasets: [
                        {
                            data: props.data,
                            backgroundColor: colors,
                        }
                    ]
                }}
                width={300}
                height={300}
                options={{maintainAspectRatio: false}}
            />
        </div>
    );
};

export default Chart;