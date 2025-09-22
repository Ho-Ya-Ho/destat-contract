import { expect } from "chai";
import { log } from "console";
import { privateEncrypt } from "crypto";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

it("Survey_init", async () => {
  const { ethers } = await network.connect();

  const title = "막무가내 설문조사";
  const description = "ㅁㅁㅁㅁㅁㅁㅁㅁㅁ";
  const questions: Question[] = [
    {
      question: "질문 입니당",
      options: ["answer1", "answer2", "answer3"],
    },
  ];

  const factory = await ethers.deployContract("SurveyFactory", [
    ethers.parseEther("50"),
    ethers.parseEther("0.1"),
  ]);
  const tx = await factory.createSurvey(
    {
      title,
      description,
      targetNumber: 100,
      questions,
    },
    { value: ethers.parseEther("100") },
  );

  const receipt = await tx.wait();
  let surveyAddress;
  receipt?.logs?.forEach((log) => {
    const event = factory.interface.parseLog(log);
    if (event?.name == "SurveyCreacted") {
      surveyAddress = event.args[0];
    }
  });

  const surveyC = await ethers.getContractFactory("Survey");
  const signers = await ethers.getSigners();
  const respondent = signers[0];
  if (surveyAddress) {
    const survey = await surveyC.attach(surveyAddress);
    await survey.connect(respondent);
    console.log(
      ethers.formatEther(await ethers.provider.getBalance(respondent)),
    );
    const submitTx = await survey.submitAnswer({
      respondent,
      answers: [1],
    });
    await submitTx.wait();
    console.log(
      ethers.formatEther(await ethers.provider.getBalance(respondent)),
    );
  }
});
