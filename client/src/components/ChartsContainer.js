import React, {useState} from 'react';
import Wrapper from "../assets/wrappers/ChartsContainer";
import {useAppContext} from "../context/appContext";
import AreaChartComponent from "./AreaChartComponent";
import BarChart from "./BarChartComponenet";

const ChartsContainer = () => {
    const [barChart, setBarChart] = useState();
    const {monthlyApplications: data} = useAppContext();

    return (
        <Wrapper>
            <h4>Monthly Applications</h4>
            <button type='button' onClick={() => setBarChart(!barChart)}>
                {barChart ? 'AreaChartComponent' : 'BarChart'}
            </button>
            {barChart ? <BarChart data={data}/> : <AreaChartComponent data={data}/>}
        </Wrapper>
    );
};

export default ChartsContainer;