// app.js
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { keypair_2, infuraKey, employee_test } from './account';
import { EthrDID } from 'ethr-did';
import { useEffect, useState } from 'react';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';

const App = ({ result }) => {

  const providerConfig = { name: 'mainnet', rpcUrl: `https://mainnet.infura.io/v3/${infuraKey}` };
  const ethrDidResolver = getResolver(providerConfig);
  const resolver = new Resolver(ethrDidResolver);

  const [recoverdDID, setRecoveredDID] = useState("")
  const ethrDid_2 = new EthrDID({ ...keypair_2 });
  const didRecover = async () => {
    const did = localStorage.getItem("planzDID");
    if (!did) {
      return false;
    }
    const res = await ethrDid_2.verifyJWT(did, resolver);
    console.log([res]);
    setRecoveredDID([res]);
  }

  const [checkSigner, setCheckSigner] = useState(false);
  const vendingMachineCheck = async () => {
    const res = await didRecover();
    if (!res) {
      alert('검증할 DID가 없습니다');
      return;
    };
    const companyAccount = '0x9021361C5226099AA99370DfeD181c9E31469d3B'
    if (recoverdDID) {
      const signer = recoverdDID[0].signer.blockchainAccountId;
      const tokens = signer.split(':');
      const lastToken = tokens[tokens.length - 1];
      console.log("signer: " + lastToken);
      if (companyAccount === lastToken) {
        setCheckSigner(true);
        alert("유효한 서명 값, 커피 제조가 시작됩니다 !")
      }
      return;
    }
    return;
  }

  return (
    <div id="app">
      <div className="inner-box">
        <h1>{result}</h1>
        <h3>DID 정보 풀어서 체크 (커피머신) <button onClick={vendingMachineCheck} style={{ marginTop: "30px" }}>verify</button></h3>
        {recoverdDID.length ?
          <div>
            <p>요청자 : {recoverdDID[0].payload.claims.account}</p>
            <p>서명자 : {recoverdDID[0].signer.blockchainAccountId}</p>
          </div> : <></>
        }
        {checkSigner ? <p>유효한 서명값입니다. 커피 제조 시작! </p> : <></>}
      </div>
    </div>
  );
};

export default App;
