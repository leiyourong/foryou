import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Divider, Dropdown, Flex, Progress, Row, Space, Statistic, Switch, Tag, Typography, Segmented } from 'antd';
import { playWord, playCongratulations, isSpeechSupported } from '../utils/speech';
import { vocabularyData, VocabItem } from '../data/vocabularyData';
import YuzuLogo from '../components/YuzuLogo';

type Difficulty = 'easy' | 'medium' | 'hard';

type CardItem = {
  id: number;
  word: VocabItem;
  matched: boolean;
};

type FlipState = {
  first?: number;
  second?: number;
};

const DIFFICULTY_MAP: Record<Difficulty, { rows: number; cols: number }> = {
  easy: { rows: 3, cols: 4 },
  medium: { rows: 4, cols: 4 },
  hard: { rows: 4, cols: 5 }
};

const flattenWords = () => Object.values(vocabularyData).flat();

const makeDeck = (pairs: number, words: VocabItem[]): CardItem[] => {
  const chosen = [...words].sort(() => Math.random() - 0.5).slice(0, pairs);
  let id = 0;
  const deck: CardItem[] = [];
  chosen.forEach((word) => {
    deck.push({ id: id++, word, matched: false });
    deck.push({ id: id++, word, matched: false });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Games: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showEnglish, setShowEnglish] = useState(true);
  const [showChinese, setShowChinese] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  const [deck, setDeck] = useState<CardItem[]>([]);
  const [flip, setFlip] = useState<FlipState>({});
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const totalPairs = useMemo(() => {
    const { rows, cols } = DIFFICULTY_MAP[difficulty];
    return (rows * cols) / 2;
  }, [difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (timerRunning) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerRunning]);

  const startGame = () => {
    const words = flattenWords();
    const deck = makeDeck(totalPairs, words);
    setDeck(deck);
    setFlip({});
    setMoves(0);
    setMatched(0);
    setSeconds(0);
    setTimerRunning(true);
  };

  const endGame = () => {
    setTimerRunning(false);
    playCongratulations();
  };

  useEffect(() => {
    if (matched === totalPairs && totalPairs > 0) {
      endGame();
    }
  }, [matched, totalPairs]);

  const handleFlip = (id: number) => {
    if (flip.second !== undefined || deck.find((c) => c.id === id)?.matched) return;

    if (flip.first === undefined) {
      setFlip({ first: id });
      const card = deck.find((c) => c.id === id);
      if (card && playSound) playWord(card.word.english);
      return;
    }

    if (flip.first === id) return;

    setFlip({ first: flip.first, second: id });
    setMoves((m) => m + 1);

    const firstCard = deck.find((c) => c.id === flip.first);
    const secondCard = deck.find((c) => c.id === id);
    if (!firstCard || !secondCard) return;

    const isMatch = firstCard.word.english === secondCard.word.english;
    if (isMatch) {
      setDeck((prev) =>
        prev.map((c) => (c.id === firstCard.id || c.id === secondCard.id ? { ...c, matched: true } : c))
      );
      setMatched((m) => m + 1);
      setTimeout(() => setFlip({}), 400);
      if (playSound) playWord('Excellent!');
    } else {
      setTimeout(() => setFlip({}), 900);
    }
  };

  const isFlipped = (id: number) => id === flip.first || id === flip.second;

  const { rows, cols } = DIFFICULTY_MAP[difficulty];

  const progress = Math.round((matched / totalPairs) * 100);

  const settingsMenu = {
    items: [
      {
        key: 'easy',
        label: '简单 3x4',
        onClick: () => setDifficulty('easy')
      },
      {
        key: 'medium',
        label: '中等 4x4',
        onClick: () => setDifficulty('medium')
      },
      {
        key: 'hard',
        label: '困难 4x5',
        onClick: () => setDifficulty('hard')
      }
    ]
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <YuzuLogo subtitle="单词小游戏" />
        <Dropdown menu={settingsMenu} trigger={['click']}>
          <Button size="small" shape="circle">
            ⋯
          </Button>
        </Dropdown>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            title="记忆配对设置"
            extra={
              <Badge
                status={timerRunning ? 'processing' : 'default'}
                text={timerRunning ? '进行中' : '未开始'}
              />
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Segmented
                block
                options={[
                  { label: '简单 3x4', value: 'easy' },
                  { label: '中等 4x4', value: 'medium' },
                  { label: '困难 4x5', value: 'hard' }
                ]}
                value={difficulty}
                onChange={(v) => setDifficulty(v as Difficulty)}
              />
              <Flex gap={12} align="center">
                <Switch checked={showEnglish} onChange={setShowEnglish} />
                <span>显示英文</span>
              </Flex>
              <Flex gap={12} align="center">
                <Switch checked={showChinese} onChange={setShowChinese} />
                <span>显示中文</span>
              </Flex>
              <Flex gap={12} align="center">
                <Switch checked={playSound} onChange={setPlaySound} disabled={!isSpeechSupported} />
                <span>播放发音</span>
                {!isSpeechSupported && <Tag color="red">浏览器不支持</Tag>}
              </Flex>
              <Button type="primary" onClick={startGame}>
                开始新游戏
              </Button>
            </Space>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <Row gutter={12}>
              <Col span={12}>
                <Statistic title="匹配对" value={`${matched}/${totalPairs}`} />
              </Col>
              <Col span={12}>
                <Statistic title="翻牌次数" value={moves} />
              </Col>
            </Row>
            <Divider />
            <Statistic title="用时" value={formatTime(seconds)} />
            <Progress percent={progress} status={matched === totalPairs ? 'success' : 'active'} />
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title="记忆配对"
            extra={
              <Space>
                <Tag color="blue">
                  {rows} x {cols}
                </Tag>
                <Tag color="purple">共 {totalPairs} 对</Tag>
              </Space>
            }
          >
            {!deck.length && <Alert message="点击左侧开始新游戏" type="info" showIcon />}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: 12
              }}
            >
              {deck.map((card) => {
                const flipped = isFlipped(card.id) || card.matched;
                return (
                  <Card
                    key={card.id}
                    hoverable={!card.matched}
                    onClick={() => handleFlip(card.id)}
                    style={{
                      background: flipped ? '#f0f5ff' : '#fff',
                      minHeight: 100,
                      cursor: card.matched ? 'default' : 'pointer'
                    }}
                  >
                    {flipped ? (
                      <Space direction="vertical" size={4}>
                        {showEnglish && <Typography.Text strong>{card.word.english}</Typography.Text>}
                        {showChinese && <Typography.Text type="secondary">{card.word.chinese}</Typography.Text>}
                      </Space>
                    ) : (
                      <Typography.Text style={{ fontSize: 24 }}>🎴</Typography.Text>
                    )}
                  </Card>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Games;
