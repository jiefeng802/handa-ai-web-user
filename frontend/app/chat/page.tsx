"use client";

import {useEffect, useState} from "react";

import {PageHeader} from "@/lib/components/PageHeader/PageHeader";
import {Tabs} from "@/lib/components/ui/Tabs/Tabs";
import {useBrainContext} from "@/lib/context/BrainProvider/hooks/useBrainContext";
import {useUserData} from "@/lib/hooks/useUserData";
import {ButtonType} from "@/lib/types/QuivrButton";
import {Tab} from "@/lib/types/Tab";
import styles from "./page.module.scss";

const Channel = (): JSX.Element => {
    const {allBrains} = useBrainContext();
    const {userData} = useUserData();

    const studioTabs: Tab[] = [
    ];

    const [buttons, setButtons] = useState<ButtonType[]>([]);

    useEffect(() => {
        if (userData) {
            setButtons((prevButtons) => {
                return prevButtons.map((button) => {
                    if (button.label === "创建知识库") {
                        return {
                            ...button,
                            disabled: userData.max_brains <= allBrains.length,
                        };
                    }

                    return button;
                });
            });
        }
    }, [userData?.max_brains, allBrains.length]);

    return (
        <div className={styles.page_wrapper}>
            <div className={styles.page_header}>
                <PageHeader
                    iconName="channel"
                    label="ces"
                    buttons={buttons}
                />
            </div>
            <div className={styles.content_wrapper}>
                <Tabs tabList={studioTabs}/>
            </div>
        </div>
    );
};

export default Channel;
