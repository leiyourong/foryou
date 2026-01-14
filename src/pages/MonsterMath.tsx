import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Divider, Flex, Form, Input, Radio, Row, Space, Statistic, Tag, message, Dropdown } from 'antd';
import { MoreOutlined, TrophyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import YuzuLogo from '../components/YuzuLogo';

type Difficulty = 'easy' | 'medium' | 'hard';
type Operation = '+' | '-' | '×';

type Settings = {
  allowAddition: boolean;
  allowSubtraction: boolean;
  allowMultiplication: boolean;
  difficulty: Difficulty;
};

type Problem = {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
};

type GameState = {
  score: number;
  level: number;
  streak: number;
  maxStreak: number;
  isActive: boolean;
  currentProblem: Problem | null;
};

const defaultSettings: Settings = {
  allowAddition: true,
  allowSubtraction: true,
  allowMultiplication: false,
  difficulty: 'easy'
};

const localStorageKey = 'monsterMathSettings';

const MonsterMath: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [game, setGame] = useState<GameState>({
    score: 0,
    level: 1,
    streak: 0,
    maxStreak: 0,
    isActive: false,
    currentProblem: null
  });
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const nextTimer = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    return () => {
      if (nextTimer.current) {
        clearTimeout(nextTimer.current);
      }
    };
  }, []);

  const operations: Operation[] = useMemo(() => {
    const list: Operation[] = [];
    if (settings.allowAddition) list.push('+');
    if (settings.allowSubtraction) list.push('-');
    if (settings.allowMultiplication) list.push('×');
    return list;
  }, [settings]);

  const generateProblem = () => {
    if (!operations.length) return;
    const op = operations[Math.floor(Math.random() * operations.length)];

    const ranges: Record<Difficulty, [number, number]> = {
      easy: [1, 20],
      medium: [10, 80],
      hard: [30, 150]
    };

    const [min, max] = ranges[settings.difficulty];
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;

    let safeNum1 = num1;
    let safeNum2 = num2;
    if (op === '-' && safeNum1 < safeNum2) {
      [safeNum1, safeNum2] = [safeNum2, safeNum1];
    }

    const answer =
      op === '+' ? safeNum1 + safeNum2 : op === '-' ? safeNum1 - safeNum2 : safeNum1 * safeNum2;

    setGame((prev) => ({
      ...prev,
      currentProblem: {
        num1: safeNum1,
        num2: safeNum2,
        operation: op,
        answer
      }
    }));
    setAnswer('');
    setResult(null);
  };

  const startPractice = () => {
    if (!operations.length) {
      messageApi.warning('请至少选择一种运算类型');
      return;
    }
    setGame({
      score: 0,
      level: 1,
      streak: 0,
      maxStreak: 0,
      isActive: true,
      currentProblem: null
    });
    generateProblem();
  };

  const endPractice = () => {
    setGame((prev) => ({ ...prev, isActive: false }));
    if (nextTimer.current) {
      clearTimeout(nextTimer.current);
    }
  };

  const handleAnswer = () => {
    if (!game.isActive || !game.currentProblem) return;
    const userAnswer = Number(answer.trim());
    if (Number.isNaN(userAnswer)) {
      messageApi.info('请输入数字答案');
      return;
    }
    const correct = userAnswer === game.currentProblem.answer;

    setGame((prev) => {
      const streak = correct ? prev.streak + 1 : 0;
      const maxStreak = Math.max(prev.maxStreak, streak);
      let score = prev.score;
      if (correct) {
        let points = 10;
        if (streak > 5) points += 5;
        if (streak > 10) points += 5;
        if (prev.currentProblem?.operation === '×') points += 5;
        const multiplier = settings.difficulty === 'hard' ? 2 : settings.difficulty === 'medium' ? 1.5 : 1;
        score += Math.floor(points * multiplier);
      }
      const level = Math.floor(score / 50) + 1;

      return {
        ...prev,
        streak,
        maxStreak,
        score,
        level
      };
    });

    setResult(correct ? 'correct' : 'wrong');

    if (nextTimer.current) {
      clearTimeout(nextTimer.current);
    }
    nextTimer.current = window.setTimeout(() => {
      if (game.isActive) {
        generateProblem();
      }
    }, 1200);
  };

  const badges = (
    <Space wrap>
      {settings.allowAddition && <Tag color="green">加法</Tag>}
      {settings.allowSubtraction && <Tag color="blue">减法</Tag>}
      {settings.allowMultiplication && <Tag color="purple">乘法</Tag>}
      <Tag color="gold">难度: {settings.difficulty}</Tag>
    </Space>
  );

  const resultBanner = result ? (
    <Alert
      type={result === 'correct' ? 'success' : 'error'}
      message={result === 'correct' ? '答对了！继续保持' : '答错了，再试试'}
      showIcon
    />
  ) : null;

  const settingsMenu = {
    items: [
      {
        key: 'easy',
        label: '简单加减',
        onClick: () =>
          setSettings({
            allowAddition: true,
            allowSubtraction: true,
            allowMultiplication: false,
            difficulty: 'easy'
          })
      },
      {
        key: 'mixed',
        label: '加减乘混合',
        onClick: () =>
          setSettings({
            allowAddition: true,
            allowSubtraction: true,
            allowMultiplication: true,
            difficulty: 'medium'
          })
      },
      {
        key: 'hard',
        label: '困难挑战',
        onClick: () =>
          setSettings({
            allowAddition: true,
            allowSubtraction: true,
            allowMultiplication: true,
            difficulty: 'hard'
          })
      }
    ]
  };

  return (
    <div className="page">
      {contextHolder}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <YuzuLogo subtitle="怪兽数学" />
        <Dropdown menu={settingsMenu} trigger={['click']}>
          <Button size="small" shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={10}>
          <Card title="练习设置" extra={<Badge status={game.isActive ? 'processing' : 'default'} text={game.isActive ? '进行中' : '未开始'} />}>
            <Form layout="vertical">
              <Form.Item label="运算类型">
                <Space direction="vertical">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.allowAddition}
                      onChange={(e) => setSettings((prev) => ({ ...prev, allowAddition: e.target.checked }))}
                    />
                    &nbsp;加法
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.allowSubtraction}
                      onChange={(e) => setSettings((prev) => ({ ...prev, allowSubtraction: e.target.checked }))}
                    />
                    &nbsp;减法
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.allowMultiplication}
                      onChange={(e) => setSettings((prev) => ({ ...prev, allowMultiplication: e.target.checked }))}
                    />
                    &nbsp;乘法
                  </label>
                </Space>
              </Form.Item>

              <Form.Item label="难度" required>
                <Radio.Group
                  value={settings.difficulty}
                  onChange={(e) => setSettings((prev) => ({ ...prev, difficulty: e.target.value }))}
                >
                  <Radio.Button value="easy">简单</Radio.Button>
                  <Radio.Button value="medium">中等</Radio.Button>
                  <Radio.Button value="hard">困难</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Space>
                <Button type="primary" onClick={startPractice} icon={<ThunderboltOutlined />}>
                  开始练习
                </Button>
                <Button onClick={endPractice}>结束</Button>
              </Space>
            </Form>
          </Card>

          <Card title="当前设置" style={{ marginTop: 16 }}>
            {badges}
          </Card>
        </Col>

        <Col xs={24} md={14}>
          <Card
            title="练习面板"
            extra={
              <Space>
                <Tag color="processing">实时</Tag>
                <Tag icon={<TrophyOutlined />} color="gold">
                  LV {game.level}
                </Tag>
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="得分" value={game.score} />
              </Col>
              <Col span={8}>
                <Statistic title="连续答对" value={game.streak} />
              </Col>
              <Col span={8}>
                <Statistic title="最高连击" value={game.maxStreak} />
              </Col>
            </Row>

            <Divider />

            {game.currentProblem ? (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Flex align="center" gap={12} style={{ fontSize: 28, fontWeight: 600 }}>
                  <span>{game.currentProblem.num1}</span>
                  <span>{game.currentProblem.operation}</span>
                  <span>{game.currentProblem.num2}</span>
                  <span>=</span>
                  <Input
                    size="large"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="输入答案"
                    style={{ maxWidth: 180 }}
                    onPressEnter={handleAnswer}
                    disabled={!game.isActive}
                  />
                </Flex>

                <Space>
                  <Button type="primary" onClick={handleAnswer} disabled={!game.isActive}>
                    提交答案
                  </Button>
                  <Button onClick={generateProblem} disabled={!game.isActive}>
                    换一题
                  </Button>
                </Space>

                {resultBanner}
              </Space>
            ) : (
              <Alert message="点击“开始练习”生成题目" type="info" showIcon />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MonsterMath;
