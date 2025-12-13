import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Radio, Row, Space, Tag, Typography, message } from 'antd';
import { SoundOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { playWord, playCongratulations, isSpeechSupported } from '../utils/speech';

type Settings = {
  includeUpperCase: boolean;
  includeLowerCase: boolean;
};

type Problem = {
  letter: string;
  options: string[];
  answer: string;
  picked?: string;
};

const defaultSettings: Settings = {
  includeLowerCase: true,
  includeUpperCase: true
};

const similarLetters: Record<string, string[]> = {
  A: ['a', 'R', 'H', 'V'],
  B: ['b', 'P', 'R', 'D'],
  C: ['c', 'G', 'O', 'Q'],
  D: ['d', 'B', 'P', 'O'],
  E: ['e', 'F', 'B', 'P'],
  F: ['f', 'E', 'P', 'T'],
  G: ['g', 'C', 'O', 'Q'],
  H: ['h', 'A', 'N', 'M'],
  I: ['i', 'l', 'T', 'J'],
  J: ['j', 'I', 'L', 'T'],
  K: ['k', 'R', 'X', 'Y'],
  L: ['l', 'I', 'T', 'J'],
  M: ['m', 'N', 'W', 'H'],
  N: ['n', 'M', 'H', 'U'],
  O: ['o', 'Q', 'C', 'G'],
  P: ['p', 'B', 'R', 'D'],
  Q: ['q', 'O', 'G', 'C'],
  R: ['r', 'P', 'B', 'K'],
  S: ['s', 'Z', '5', '2'],
  T: ['t', 'I', 'L', 'J'],
  U: ['u', 'V', 'Y', 'N'],
  V: ['v', 'U', 'Y', 'A'],
  W: ['w', 'M', 'V', 'U'],
  X: ['x', 'K', 'Y', 'Z'],
  Y: ['y', 'V', 'U', 'X'],
  Z: ['z', 'S', '2', 'N']
};

const shuffle = <T,>(arr: T[]) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const generateRandomLetter = (upper: boolean, lower: boolean) => {
  const letters: string[] = [];
  if (upper) letters.push(...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
  if (lower) letters.push(...'abcdefghijklmnopqrstuvwxyz'.split(''));
  return letters[Math.floor(Math.random() * letters.length)];
};

const generateSimilarLetters = (letter: string) => {
  const upper = letter.toUpperCase();
  const lower = letter.toLowerCase();
  const options = new Set<string>([letter, upper, lower]);
  const similar = similarLetters[upper] || [];
  while (options.size < 4) {
    options.add(similar[Math.floor(Math.random() * similar.length)] || upper);
  }
  return shuffle(Array.from(options)).slice(0, 4);
};

const storageKey = 'englishSettings';

const English: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings]);

  const canGenerate = useMemo(() => settings.includeLowerCase || settings.includeUpperCase, [settings]);

  const start = () => {
    if (!canGenerate) {
      message.warning('请至少选择一种字母类型');
      return;
    }
    const list: Problem[] = [];
    for (let i = 0; i < 10; i++) {
      const letter = generateRandomLetter(settings.includeUpperCase, settings.includeLowerCase);
      list.push({
        letter,
        options: generateSimilarLetters(letter),
        answer: letter
      });
    }
    setProblems(list);
    setResult(null);
  };

  const check = () => {
    if (!problems.length) {
      message.info('请先生成题目');
      return;
    }
    const unanswered = problems.filter((p) => !p.picked);
    if (unanswered.length) {
      message.warning('还有题目未作答');
      return;
    }
    const correct = problems.filter((p) => p.picked === p.answer).length;
    setResult({ correct, total: problems.length });
    if (correct === problems.length) {
      playCongratulations();
      message.success('满分！');
    }
  };

  const updatePick = (idx: number, value: string) => {
    setProblems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], picked: value };
      return next;
    });
  };

  const badge = (
    <Space>
      {settings.includeUpperCase && <Tag color="blue">大写</Tag>}
      {settings.includeLowerCase && <Tag color="green">小写</Tag>}
      {!isSpeechSupported && <Tag color="red">浏览器不支持语音</Tag>}
    </Space>
  );

  return (
    <div className="page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="练习设置" extra={badge}>
            <Form layout="vertical">
              <Form.Item label="字母类型">
                <Radio.Group
                  value={settings.includeUpperCase ? (settings.includeLowerCase ? 'both' : 'upper') : 'lower'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'both') setSettings({ includeLowerCase: true, includeUpperCase: true });
                    if (val === 'upper') setSettings({ includeLowerCase: false, includeUpperCase: true });
                    if (val === 'lower') setSettings({ includeLowerCase: true, includeUpperCase: false });
                  }}
                >
                  <Radio.Button value="both">大小写</Radio.Button>
                  <Radio.Button value="upper">仅大写</Radio.Button>
                  <Radio.Button value="lower">仅小写</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Space>
                <Button type="primary" onClick={start}>
                  新的题目
                </Button>
                <Button onClick={check} disabled={!problems.length}>
                  检查答案
                </Button>
              </Space>
            </Form>
          </Card>
          {result && (
            <Card style={{ marginTop: 16 }}>
              <Alert
                type={result.correct === result.total ? 'success' : 'info'}
                message={`本次得分：${result.correct * 10} 分，答对 ${result.correct}/${result.total}`}
                showIcon
              />
            </Card>
          )}
        </Col>

        <Col xs={24} md={16}>
          <Card
            title="字母选择题"
            extra={<Tag color="purple">{problems.length ? '共 10 题' : '点击生成题目'}</Tag>}
          >
            {!problems.length && <Alert message="先在左侧生成新的题目" type="info" showIcon />}
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {problems.map((p, idx) => {
                const isCorrect = result && p.picked === p.answer;
                const isWrong = result && p.picked && p.picked !== p.answer;
                return (
                  <Card
                    key={idx}
                    size="small"
                    title={
                      <Space>
                        <span>第 {idx + 1} 题</span>
                        {isCorrect && <CheckCircleTwoTone twoToneColor="#52c41a" />}
                        {isWrong && <CloseCircleTwoTone twoToneColor="#ff4d4f" />}
                      </Space>
                    }
                    extra={
                      <Button
                        size="small"
                        icon={<SoundOutlined />}
                        onClick={() => playWord(p.letter)}
                        disabled={!isSpeechSupported}
                      >
                        听读
                      </Button>
                    }
                  >
                    <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>{p.letter}</div>
                    <Radio.Group
                      onChange={(e) => updatePick(idx, e.target.value)}
                      value={p.picked}
                      options={p.options.map((o) => ({ label: o, value: o }))}
                      optionType="button"
                      buttonStyle="solid"
                    />
                    {result && isWrong && (
                      <div style={{ marginTop: 8, color: '#ff4d4f' }}>正确答案：{p.answer}</div>
                    )}
                  </Card>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default English;

