import { network } from "hardhat";
import { ethers } from "ethers";
import { expect } from "chai";

describe("SurveyFactory Contract", () => {
  let factory: any, owner: any, respondent1: any, respondent2: any;

  beforeEach(async () => {
    const { ethers } = await network.connect();

    [owner, respondent1, respondent2] = await ethers.getSigners();

    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"), // min_pool_amount
      ethers.parseEther("0.1"), // min_reward_amount
    ]);
  });

  it("should deploy with correct minimum amounts", async () => {
    const minPoolAmount = await factory.getMinPoolAmount();
    const minRewardAmount = await factory.getMinRewardAmount();

    expect(minPoolAmount).to.equal(ethers.parseEther("50"));
    expect(minRewardAmount).to.equal(ethers.parseEther("0.1"));
  });

  it("should create a new survey when valid values are provided", async () => {
    const surveyData = {
      title: "Test Survey",
      description: "Test Description",
      targetNumber: 100,
      questions: [
        {
          question: "Test Question",
          options: ["Option 1", "Option 2", "Option 3"],
        },
      ],
    };

    const tx = await factory.createSurvey(surveyData, {
      value: ethers.parseEther("100"),
    });
    const receipt = await tx.wait();

    expect(receipt.logs.length).to.be.greaterThan(0);
    const event = factory.interface.parseLog(receipt.logs[0]);
    expect(event?.name).to.equal("SurveyCreated");

    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(1);
  });

  it("should revert if pool amount is too small", async () => {
    const surveyData = {
      title: "Test Survey",
      description: "Test Description",
      targetNumber: 100,
      questions: [
        {
          question: "Test Question",
          options: ["Option 1", "Option 2"],
        },
      ],
    };

    await expect(
      factory.createSurvey(surveyData, { value: ethers.parseEther("49") }),
    ).to.be.revertedWith(
      "Pool amount must be greater than minimum pool amount",
    );
  });

  it("should revert if reward amount per respondent is too small", async () => {
    const surveyData = {
      title: "Test Survey",
      description: "Test Description",
      targetNumber: 1000,
      questions: [
        {
          question: "Test Question",
          options: ["Option 1", "Option 2"],
        },
      ],
    };

    await expect(
      factory.createSurvey(surveyData, { value: ethers.parseEther("50") }),
    ).to.be.revertedWith(
      "Reward amount must be greater than minimum reward amount",
    );
  });

  it("should store created surveys and return them from getSurveys", async () => {
    const surveyData1 = {
      title: "Survey 1",
      description: "Description 1",
      targetNumber: 100,
      questions: [
        {
          question: "Question 1",
          options: ["Option 1", "Option 2"],
        },
      ],
    };

    const surveyData2 = {
      title: "Survey 2",
      description: "Description 2",
      targetNumber: 100,
      questions: [
        {
          question: "Question 1",
          options: ["Option 1", "Option 2"],
        },
      ],
    };

    // ── Survey 1 생성 ──
    const tx1 = await factory.createSurvey(surveyData1, {
      value: ethers.parseEther("100"),
    });
    const receipt1 = await tx1.wait();
    const surveyAddress1 = receipt1.logs.find(
      (log: any) => log.fragment?.name === "SurveyCreated",
    )?.args?.[0];

    // ── Survey 2 생성 ──
    const tx2 = await factory.createSurvey(surveyData2, {
      value: ethers.parseEther("100"),
    });
    const receipt2 = await tx2.wait();
    const surveyAddress2 = receipt2.logs.find(
      (log: any) => log.fragment?.name === "SurveyCreated",
    )?.args?.[0];

    // ── getSurveys()로 주소 배열 확인 ──
    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(2);
    expect(surveys[0]).to.equal(surveyAddress1);
    expect(surveys[1]).to.equal(surveyAddress2);
  });
});
