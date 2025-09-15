import { expect } from "chai";
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

  const s = await ethers.deployContract("Survey", [
    title,
    description,
    questions,
  ]);

  const _title = await s.title();
  const _desc = await s.description();
  const _questions = (await s.getQuestions()) as Question[];
  expect(_title).eq(title);
  expect(_desc).eq(description);
  expect(_questions[0].options).deep.eq(questions[0].options);
});
