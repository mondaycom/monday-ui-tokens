import React from 'react';
import "./tokens.scss";

export default function tokens({scope, name, type}) {

    return (
        <div>
            <h3>{name} tokens</h3>
            <table className={"tokens-table"}>
                <tr>
                    <th>Name</th>
                    <th>Swatch</th>
                    <th>Value</th>
                    <th>HSL</th>
                    <th>RGB</th>
                    <th>Role</th>
                </tr>
                {Object.entries(scope).map((t, k) =>
                    <tr key={k}>
                        <td title={t[0] + ":" + t[1]}>{t[0]}</td>
                        <td {...(type && {style: {[type]: t[1][0]}})}></td>
                        <td>{t[1][0]}</td>
                        <td>{t[1][1]}</td>
                        <td>{t[1][2]}</td>
                        <td>{t[1][3]}</td>
                    </tr>)}
            </table>
        </div>
    );
}
