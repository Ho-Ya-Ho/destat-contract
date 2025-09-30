import { expect } from "chai";
import { log } from "console";
import { privateEncrypt } from "crypto";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

// it("Survey_init", async () => {
//   const { ethers } = await network.connect();
//
//   const title = "막무가내 설문조사";
//   const description = "ㅁㅁㅁㅁㅁㅁㅁㅁㅁ";
//   const questions: Question[] = [
//     {
//       question: "질문 입니당",
//       options: ["answer1", "answer2", "answer3"],
//     },
//   ];
//
//   const factory = await ethers.deployContract("SurveyFactory", [
//     ethers.parseEther("50"),
//     ethers.parseEther("0.1"),
//   ]);
//   const tx = await factory.createSurvey(
//     {
//       title,
//       description,
//       targetNumber: 100,
//       questions,
//     },
//     { value: ethers.parseEther("100") },
//   );
//
//   const receipt = await tx.wait();
//   let surveyAddress;
//   receipt?.logs?.forEach((log) => {
//     const event = factory.interface.parseLog(log);
//     if (event?.name == "SurveyCreated") {
//       surveyAddress = event.args[0];
//     }
//   });
//
//   const surveyC = await ethers.getContractFactory("Survey");
//   const signers = await ethers.getSigners();
//   const respondent = signers[0];
//   if (surveyAddress) {
//     const survey = await surveyC.attach(surveyAddress);
//     await survey.connect(respondent);
//     console.log(
//       ethers.formatEther(await ethers.provider.getBalance(respondent)),
//     );
//     const submitTx = await survey.submitAnswer({
//       respondent,
//       answers: [1],
//     });
//     await submitTx.wait();
//     console.log(
//       ethers.formatEther(await ethers.provider.getBalance(respondent)),
//     );
//   }
// });

it("Survey Storage Layout", async () => {
  const { ethers } = await network.connect();

  const title = "막무가내 설문조사";
  const description = "ㅁㅁㅁㅁㅁㅁㅁㅁㅁqpqlalamzjsj";
  const questions: Question[] = [
    {
      question: "질문 입니당gggggggggggggggggggggg",
      options: ["answer1", "answer2", "answer3"],
    },
    {
      question: "질문 입니당2",
      options: ["answer2-1", "answer2-2", "answer2-3"],
    },
  ];

  const survey = await ethers.deployContract(
    "Survey",
    [title, description, 100, questions],
    { value: ethers.parseEther("100") },
  );

  const decodeUni = (hex: string) =>
    Buffer.from(hex.slice(2), "hex").toString("utf-8");
  const nextHash = (hex: string, i: number) => {
    const n = BigInt(hex) + BigInt(i);
    return "0x" + n.toString(16).padStart(64, "0");
  };

  const slot0Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(0, 32),
  );
  const slot1Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(1, 32),
  );
  const slot2Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(2, 32),
  );
  const slot3Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(3, 32),
  );
  const slot4Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(4, 32),
  );
  const slot5Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(5, 32),
  );
  const slot6Data = await ethers.provider.getStorage(
    survey.getAddress(),
    ethers.toBeHex(6, 32),
  );

  console.log("primitive types:");
  console.log(slot2Data);
  console.log(slot3Data);

  console.log("long string types:");
  console.log(slot1Data);
  const pDesc = ethers.keccak256(ethers.toBeHex(1, 32));
  const desc0 = await ethers.provider.getStorage(
    await survey.getAddress(),
    pDesc,
  );
  const desc1 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 1),
  );
  const desc2 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 2),
  );
  const desc3 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 3),
  );
  const desc4 = await ethers.provider.getStorage(
    await survey.getAddress(),
    nextHash(pDesc, 4),
  );
  console.log(desc0);
  console.log(desc1);
  console.log(desc2);
  console.log(desc3);
  console.log(desc4);

  console.log("\n---Array types:---");
  console.log("slot4Data", slot4Data);
  const pQuestions = ethers.keccak256(ethers.toBeHex(4, 32));
  const question1 = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 0),
  );
  const question1_option_array = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 1),
  );
  const question2 = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 2),
  );
  const question2_option_array = await ethers.provider.getStorage(
    survey.getAddress(),
    nextHash(pQuestions, 3),
  );

  console.log("question1", question1);
  console.log("question1_option[]", question1_option_array);
  console.log("question2", question2);
  console.log("question2_option[]", question2_option_array);
});
