// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Question {
    string question;
    string[] options;
}

struct Answer {
    address respondent;
    uint8[] answers;
}

contract Survey {
    // contract의 field는 storage에 저장됨
    // Key-Value Storage
    string public title;
    string public description;
    uint256 public targetNumber;
    uint256 public rewardAmount;
    Question[] questions;
    Answer[] answers;
    mapping(address => uint) testMap;

    // primitive: int, bool, uint -> primitive은 memory, storage 키워드를 사용하지 않아도됨
    // primitive 타입 + string 일 경우 하나의 slot을 나눠서 사용한다 (32bytes보다 작다면)
    // memory, storage, calldata
    constructor(
        string memory _title,
        string memory _description,
        uint256 _targetNumber,
        Question[] memory _questions
    ) payable {
        title = _title;
        description = _description;
        targetNumber = _targetNumber;
        rewardAmount = msg.value / targetNumber;
        testMap[msg.sender] = 1000;
        for (uint i = 0; i < _questions.length; i++) {
            questions.push(
                Question({
                    question: _questions[i].question,
                    options: _questions[i].options
                })
            );

            // Question storage q = questions.push();
            // q.question = _questions[i].question;
            // q.options = _questions[i].options;
        }
    }

    function submitAnswer(Answer calldata _answers) external {
        // length validation
        require(
            _answers.answers.length == questions.length,
            "Number of answers must match number of questions"
        );
        require(
            answers.length < targetNumber,
            "Target number of responses reached"
        );

        answers.push(
            Answer({respondent: msg.sender, answers: _answers.answers})
        );
        payable(msg.sender).transfer(rewardAmount);
    }

    function getAnswers() external view returns (Answer[] memory) {
        return answers;
    }

    function getQuestions() external view returns (Question[] memory) {
        return questions;
    }
}
