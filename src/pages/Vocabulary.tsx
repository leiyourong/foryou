import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  List,
  Radio,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
  message
} from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { vocabularyData, VocabItem } from '../data/vocabularyData';
import { playWord, playCongratulations, isSpeechSupported } from '../utils/speech';

type StudyMode = 'learn' | 'quiz';
type QuizRange = 'current' | 'all';

type QuizState = {
  words: VocabItem[];
  idx: number;
  correct: number;
};

const storageKey = 'vocabularySettings';

const Vocabulary: React.FC = () => {
  const [lesson, setLesson] = useState('lesson1');
  const [mode, setMode] = useState<StudyMode>('learn');
  const [quizRange, setQuizRange] = useState<QuizRange>('current');
  const [showTranslation, setShowTranslation] = useState(true);
  const [count, setCount] = useState(10);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setLesson(data.lesson || 'lesson1');
        setMode(data.mode || 'learn');
        setQuizRange(data.quizRange || 'current');
        setShowTranslation(data.showTranslation ?? true);
        setCount(data.count || 10);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ lesson, mode, quizRange, showTranslation, count })
    );
  }, [lesson, mode, quizRange, showTranslation, count]);

  const lessons = Object.keys(vocabularyData);
  const currentWords = useMemo(() => vocabularyData[lesson] || [], [lesson]);
  const allWords = useMemo(() => lessons.flatMap((k) => vocabularyData[k]), [lessons]);

  const startQuiz = () => {
    const source = quizRange === 'current' ? [...currentWords] : [...allWords];
    if (!source.length) return;
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    const words = shuffled.slice(0, Math.min(count, source.length));
    setQuiz({ words, idx: 0, correct: 0 });
    setSelected(null);
  };

  const currentQuestion = quiz ? quiz.words[quiz.idx] : null;

  const makeOptions = (word: VocabItem) => {
    const opts = new Set<VocabItem>([word]);
    const pool = [...allWords];
    while (opts.size < 4 && pool.length) {
      const candidate = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      if (candidate) opts.add(candidate);
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  const [options, setOptions] = useState<VocabItem[]>([]);

  useEffect(() => {
    if (currentQuestion) {
      setOptions(makeOptions(currentQuestion));
      setSelected(null);
    }
  }, [quiz?.idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitAnswer = (opt: VocabItem) => {
    if (!quiz || !currentQuestion) return;
    const isCorrect = opt.english === currentQuestion.english;
    const nextCorrect = quiz.correct + (isCorrect ? 1 : 0);
    const nextIdx = quiz.idx + 1;
    if (nextIdx >= quiz.words.length) {
      setQuiz({ ...quiz, correct: nextCorrect, idx: nextIdx });
      if (isCorrect && nextCorrect === quiz.words.length) {
        playCongratulations();
      }
    } else {
      setQuiz({ ...quiz, correct: nextCorrect, idx: nextIdx });
    }
    setSelected(opt.english);
    message[isCorrect ? 'success' : 'info'](isCorrect ? '答对了！' : '再试试');
  };

  const quizDone = quiz && quiz.idx >= quiz.words.length;

  return (
    <div className="page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="学习设置">
            <Form layout="vertical">
              <Form.Item label="模式">
                <Radio.Group
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value);
                    if (e.target.value === 'quiz') startQuiz();
                  }}
                >
                  <Radio.Button value="learn">学习</Radio.Button>
                  <Radio.Button value="quiz">测验</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="显示中文释义">
                <Radio.Group
                  value={showTranslation ? 'yes' : 'no'}
                  onChange={(e) => setShowTranslation(e.target.value === 'yes')}
                >
                  <Radio.Button value="yes">显示</Radio.Button>
                  <Radio.Button value="no">隐藏</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="测验范围">
                <Radio.Group
                  value={quizRange}
                  onChange={(e) => setQuizRange(e.target.value)}
                  disabled={mode !== 'quiz'}
                >
                  <Radio.Button value="current">当前课</Radio.Button>
                  <Radio.Button value="all">全部</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="题目数量">
                <InputNumber
                  min={5}
                  max={30}
                  value={count}
                  onChange={(v) => setCount(v || 10)}
                  disabled={mode !== 'quiz'}
                />
              </Form.Item>
              {mode === 'quiz' && (
                <Button type="primary" block onClick={startQuiz}>
                  重新生成题目
                </Button>
              )}
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title="课程选择"
            extra={
              <Space>
                <Tag color="blue">{lessons.length} 个单元</Tag>
                {!isSpeechSupported && <Tag color="red">浏览器不支持语音</Tag>}
              </Space>
            }
          >
            <Tabs
              activeKey={lesson}
              onChange={(k) => {
                setLesson(k);
                if (mode === 'quiz') startQuiz();
              }}
              items={lessons.map((k) => ({
                key: k,
                label: k.replace('lesson', '第 ') + ' 课'
              }))}
            />

            {mode === 'learn' && (
              <List
                dataSource={currentWords}
                renderItem={(w) => (
                  <List.Item
                    actions={[
                      <Button
                        key="speak"
                        icon={<SoundOutlined />}
                        size="small"
                        onClick={() => playWord(w.english)}
                        disabled={!isSpeechSupported}
                      >
                        听读
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <strong>{w.english}</strong>
                          <Tag color="geekblue">{w.phonetic}</Tag>
                        </Space>
                      }
                      description={
                        showTranslation ? <span>{w.chinese}</span> : <span style={{ color: '#ccc' }}>隐藏</span>
                      }
                    />
                  </List.Item>
                )}
              />
            )}

            {mode === 'quiz' && (
              <div>
                {!quiz && <Alert type="info" message="点击左侧生成题目开始测验" showIcon />}
                {quiz && !quizDone && currentQuestion && (
                  <Card type="inner" title={`第 ${quiz.idx + 1} / ${quiz.words.length} 题`}>
                    <div style={{ fontSize: 24, marginBottom: 12 }}>
                      <Space>
                        <Button
                          size="small"
                          icon={<SoundOutlined />}
                          onClick={() => playWord(currentQuestion.english)}
                          disabled={!isSpeechSupported}
                        >
                          听读
                        </Button>
                        <span>{currentQuestion.english}</span>
                        <Tag color="geekblue">{currentQuestion.phonetic}</Tag>
                      </Space>
                    </div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {options.map((opt) => (
                        <Button
                          key={opt.english}
                          block
                          type={selected === opt.english ? 'primary' : 'default'}
                          onClick={() => submitAnswer(opt)}
                          disabled={selected !== null}
                        >
                          {opt.chinese}
                        </Button>
                      ))}
                    </Space>
                  </Card>
                )}
                {quiz && quizDone && (
                  <Card type="inner" title="测验结束">
                    <Alert
                      type={quiz.correct === quiz.words.length ? 'success' : 'info'}
                      message={`得分：${Math.round((quiz.correct / quiz.words.length) * 100)}%`}
                      description={`答对 ${quiz.correct} / ${quiz.words.length}`}
                      showIcon
                    />
                    <Divider />
                    <Button type="primary" onClick={startQuiz}>
                      再来一组
                    </Button>
                  </Card>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Vocabulary;

