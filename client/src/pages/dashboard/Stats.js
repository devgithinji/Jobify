import React, {useEffect} from 'react';
import {useAppContext} from "../../context/appContext";
import Loading from "../../components/Loading";
import {StatsContainer, ChartsContainer} from "../../components";

const Stats = () => {
    const {showStats, isLoading, monthlyApplications} = useAppContext();

    useEffect(() => {
        showStats()
        // eslint-disable-next-line
    }, [])

    if (isLoading) {
        return <Loading center/>
    }
    return (
        <>
            <StatsContainer/>
            {monthlyApplications.length > 0 && <ChartsContainer/>}
        </>
    );
};

export default Stats;