import { useEffect, useRef, useState } from 'react';
import "./SettingsTab.css";

export default function SettingsTab() {
    return (
        <div id="SettingsTab" tabIndex={-1}>
            <input type="range" style={{width: "100%"}}/>
        </div>
    )
}