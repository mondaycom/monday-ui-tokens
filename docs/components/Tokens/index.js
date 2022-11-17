import React from 'react';
import "./tokens.scss";

export default function tokens({scope, name, type, styles}) {

    return (
        <div>
            <h3>{name} tokens</h3>
            <table className={"tokens-table"}>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                    <th>Role</th>
                    <th>Reference</th>
                </tr>
                {Object.entries(scope).map((t, k) => <tr key={k} value={t[0]}>
                    <td title={t[0] + ":" + t[1]}>{t[0]}</td>
                    <td>{t[1][0]}</td>
                    <td>{t[1][1]}</td>
                    <td {...(type && {style: {[type]: t[1][0]}})}></td>
                </tr>)}
            </table>
        </div>
    );
}
