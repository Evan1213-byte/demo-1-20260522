"use client";

import { useState } from "react";
import { Search, Sparkles, X, Plus, ThumbsUp, ThumbsDown, CheckCircle2, ChevronRight, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --- Types ---
type Step = "input" | "parsing" | "tweaking" | "preview" | "export" | "done";

interface HardCondition {
  id: string;
  key: string;
  value: string;
}

interface MockProfile {
  id: string;
  name: string;
  location: string;
  age: string;
  gender: string;
  description: string;
  cityLevel?: string;
  consumptionLevel?: string;
  activeTime?: string;
  device?: string;
}

interface MockData {
  hardConditions: HardCondition[];
  softIntent: string;
  estimatedSize: number;
  profiles: MockProfile[];
}

// --- Mock Data Generator ---
function generateMockData(query: string): MockData {
  const q = query.toLowerCase();
  
  if (q.includes("亲子") || q.includes("六一") || q.includes("孩")) {
    return {
      hardConditions: [
        { id: "1", key: "是否有孩", value: "是" },
        { id: "2", key: "孩子年龄", value: "3-12岁" },
        { id: "3", key: "时间约束", value: "近15天" }
      ],
      softIntent: "关注亲子游乐园、家庭出行旅游攻略、机票酒店预订，注重家庭陪伴体验，具备中高消费能力。",
      estimatedSize: 853000 + Math.floor(Math.random() * 50000), // 动态波动
      profiles: [
        { id: "p1", name: "用户 A", location: "成都", age: "35", gender: "女性", description: "日常精力聚焦于孩子成长，消费注重性价比与体验，近期多次搜索了本地及周边亲子游乐园信息，具备家庭决策权。" },
        { id: "p2", name: "用户 B", location: "杭州", age: "32", gender: "男性", description: "关注自驾游和家庭出游攻略，近期浏览过多个SUV车型的后备箱空间评测，倾向于为家人提供舒适的出行体验。" },
        { id: "p3", name: "用户 C", location: "南京", age: "30", gender: "女性", description: "热衷给孩子买高品质童装和教育产品，经常在周末带孩子去博物馆和游乐场，是某亲子年卡的忠实用户。" }
      ]
    };
  }
  
  if (q.includes("车") || q.includes("新能源") || q.includes("汽车")) {
    return {
      hardConditions: [
        { id: "1", key: "有车一族", value: "否/准备置换" },
        { id: "2", key: "驾照", value: "有" },
        { id: "3", key: "常驻地", value: "一二线城市" }
      ],
      softIntent: "近期频繁浏览汽车资讯，关注电池续航、智能驾驶、充电桩分布，有环保意识和科技尝鲜意愿。",
      estimatedSize: 1240000 + Math.floor(Math.random() * 100000),
      profiles: [
        { id: "p1", name: "用户 X", location: "上海", age: "28", gender: "男性", description: "科技数码爱好者，通勤距离长，对智能驾驶辅助系统极度关注，最近在对比特斯拉和小鹏的试驾体验。" },
        { id: "p2", name: "用户 Y", location: "深圳", age: "31", gender: "女性", description: "注重车辆颜值与内饰质感，考虑接送孩子和日常代步，对续航里程和充电便利性有较高要求。" },
        { id: "p3", name: "用户 Z", location: "北京", age: "34", gender: "男性", description: "传统油车车主，因限行和高油价考虑置换纯电SUV，偏好大空间和成熟的售后服务网络，预算在25万左右。" }
      ]
    };
  }

  if (q.includes("美妆") || q.includes("护肤") || q.includes("口红")) {
    return {
      hardConditions: [
        { id: "1", key: "性别", value: "女性" },
        { id: "2", key: "年龄", value: "18-35岁" },
        { id: "3", key: "活跃平台", value: "小红书/抖音" }
      ],
      softIntent: "热衷于美妆护肤评测，关注抗老、美白、保湿等功效成分，易受KOL种草影响，追求精致生活。",
      estimatedSize: 2150000 + Math.floor(Math.random() * 200000),
      profiles: [
        { id: "p1", name: "用户 M", location: "北京", age: "24", gender: "女性", description: "都市白领，经常熬夜，近期大量浏览抗初老精华和遮瑕粉底液的相关评测，对大牌护肤品有较高的信任度。" },
        { id: "p2", name: "用户 N", location: "成都", age: "29", gender: "女性", description: "美妆达人，喜欢尝试各种新奇的彩妆单品，注重眼妆和唇妆的色彩搭配，经常在社交平台分享自己的妆容。" },
        { id: "p3", name: "用户 O", location: "西安", age: "21", gender: "女性", description: "在校大学生，对平价替代和高性价比彩妆情有独钟，习惯在直播间蹲守优惠，对国货美妆品牌接受度高。" }
      ]
    };
  }
  
  // Default fallback for any other queries
  return {
    hardConditions: [
      { id: "1", key: "活跃度", value: "高" },
      { id: "2", key: "消费意愿", value: "强" }
    ],
    softIntent: "近期活跃度高，展现出较强的消费意愿，对新兴事物接受度较高，容易被促销活动和高质量内容转化。",
    estimatedSize: 500000 + Math.floor(Math.random() * 200000),
    profiles: [
      { id: "p1", name: "用户 S", location: "广州", age: "27", gender: "女性", description: "生活节奏快，热衷于在线购物和社交媒体分享，容易受到高质量内容种草影响，消费决策果断。" },
      { id: "p2", name: "用户 T", location: "武汉", age: "30", gender: "男性", description: "工作稳定，周末喜欢参加小圈子聚会，对高品质生活周边产品有持续的购买兴趣，注重实用性。" },
      { id: "p3", name: "用户 U", location: "重庆", age: "25", gender: "女性", description: "兴趣广泛，热衷参与各类线上线下的打卡活动，经常在朋友圈分享日常，容易被有设计感的产品吸引。" }
    ]
  };
}

const getConditionOptions = (key: string) => {
  switch (key) {
    case "性别": return ["不限", "男性", "女性"];
    case "年龄": return ["不限", "18岁以下", "18-24岁", "25-34岁", "35-44岁", "45岁以上"];
    case "城市等级": return ["不限", "一线城市", "新一线城市", "二线城市", "三线城市", "四线及以下"];
    case "消费力": return ["不限", "低水平", "中等水平", "中高水平", "高水平"];
    case "活跃时段": return ["不限", "全天零散", "早间", "午间", "晚间", "凌晨"];
    case "是否有孩": return ["不限", "是", "否"];
    case "孩子年龄": return ["不限", "0-3岁", "3-12岁", "12岁以上"];
    case "时间约束": return ["不限", "近7天", "近15天", "近30天"];
    case "有车一族": return ["不限", "是", "否", "否/准备置换"];
    case "驾照": return ["不限", "有", "无"];
    case "活跃平台": return ["不限", "小红书/抖音", "微博", "B站"];
    case "活跃度": return ["不限", "高", "中", "低"];
    case "消费意愿": return ["不限", "强", "中", "弱"];
    case "设备价格": return ["不限", "2000元以下", "2000-4000元", "4000-6000元", "6000元以上"];
    case "设备品牌": return ["不限", "苹果", "华为", "小米", "OPPO/vivo", "其他"];
    case "婚恋状态": return ["不限", "单身", "恋爱中", "已婚", "离异"];
    case "职业": return ["不限", "学生", "白领/一般职员", "公务员/事业单位", "自由职业", "蓝领"];
    case "兴趣偏好": return ["不限", "数码科技", "美妆护肤", "运动健康", "旅游出行", "游戏电竞", "美食餐饮"];
    default: return ["不限", "是", "否", "高", "中", "低"];
  }
};

export default function NL2AudiencePage() {
  const [step, setStep] = useState<Step>("input");
  const [query, setQuery] = useState("");
  
  // 全局 Mock 结果缓存
  const [mockData, setMockData] = useState<MockData | null>(null);

  // 模块 2：微调面板状态
  const [hardConditions, setHardConditions] = useState<HardCondition[]>([]);
  const [softIntent, setSoftIntent] = useState("");
  const [strictness, setStrictness] = useState([85]); // 阈值
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [isEditingIntent, setIsEditingIntent] = useState(false);
  
  // 模块 3：规模预估状态
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [profiles, setProfiles] = useState<MockProfile[]>([]);
  const [rejectProfileId, setRejectProfileId] = useState<string | null>(null);

  // 模块 4：导出状态
  const [audienceName, setAudienceName] = useState("");
  const [targetSystems, setTargetSystems] = useState<string[]>(["发奖计划"]);
  const [marketingValidity, setMarketingValidity] = useState("永久有效");
  const [customDateRange, setCustomDateRange] = useState<Date | undefined>(new Date());
  const [rewardValidityType, setRewardValidityType] = useState("自定义");
  const [marketingCustomDateRange, setMarketingCustomDateRange] = useState<Date | undefined>(new Date());

  // --- Handlers ---
  const handleParse = () => {
    if (!query.trim()) return;
    setStep("parsing");
    
    // 生成动态数据
    const data = generateMockData(query);
    
    // 模拟大模型解析延迟
    setTimeout(() => {
      setMockData(data);
      setHardConditions(data.hardConditions);
      setSoftIntent(data.softIntent);
      setStep("tweaking");
    }, 2000);
  };

  const handleRemoveCondition = (id: string) => {
    setHardConditions(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateConditionValue = (id: string, newValue: string) => {
    setHardConditions(prev => prev.map(c => c.id === id ? { ...c, value: newValue } : c));
  };

  const handleAddNewCondition = (key: string) => {
    const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setHardConditions(prev => [...prev, { id: newId, key, value: "不限" }]);
    // 移除 setIsAddingCondition(false); 以便允许连续点击多个标签
  };

  const handleEstimate = () => {
    setStep("preview");
    setIsEstimating(true);
    // 模拟双路检索延迟
    setTimeout(() => {
      setEstimatedSize(mockData?.estimatedSize || 0);
      setProfiles(mockData?.profiles || []);
      setIsEstimating(false);
    }, 2000);
  };

  const handleExport = () => {
    setStep("export");
    // 提取查询的关键词作为默认命名
    const safeName = query.slice(0, 15).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");
    setAudienceName(`人群包-${safeName}-${new Date().toLocaleDateString()}`);
  };

  const handleFinish = () => {
    setStep("done");
  };

  const handleReset = () => {
    setStep("input");
    setQuery("");
    setMockData(null);
    setHardConditions([]);
    setSoftIntent("");
    setEstimatedSize(null);
    setProfiles([]);
    setStrictness([85]);
    setTargetSystems(["发奖计划"]);
  };

  const handleBack = () => {
    if (step === "tweaking") setStep("input");
    else if (step === "preview") setStep("tweaking");
    else if (step === "export") setStep("preview");
    else if (step === "done") setStep("export");
  };

  const toggleTargetSystem = (sys: string) => {
    if (step === "done") return;
    setTargetSystems([sys]);
  };

  const handleConfirmReject = () => {
    if (!rejectProfileId) return;
    setRejectProfileId(null);
    setIsEstimating(true);
    
    setTimeout(() => {
      // 模拟规模下降及重新生成列表
      setEstimatedSize(prev => prev ? Math.floor(prev * 0.95 * 10) / 10 : null);
      
      // 找到一个备用 profile 补充进去，保持 3 个
      const fallbackProfiles = [
        { id: `p_new_${Date.now()}`, name: "用户 补充", location: "重庆", age: "29", gender: "女性", description: "通过强化学习补充的相似受众，具备高度相似的搜索和点击行为，消费习惯稳定。" },
        { id: `p_new_${Date.now()}_2`, name: "用户 补充", location: "西安", age: "33", gender: "男性", description: "通过强化学习补充的相似受众，近期有相关的深度转化行为，是高潜力的目标群体。" }
      ];
      
      setProfiles(prev => {
        const filtered = prev.filter(p => p.id !== rejectProfileId);
        // 确保补充后依然是 3 个（如果原先是 3 个的话）
        if (filtered.length < 3) {
           filtered.push(fallbackProfiles[Math.floor(Math.random() * fallbackProfiles.length)]);
        }
        return filtered;
      });
      
      setIsEstimating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              NL2Audience <span className="text-xl font-medium text-slate-500">意图人群生成台</span>
            </h1>
            <p className="text-slate-500 mt-2">将自然语言业务诉求，精准翻译并映射到 AI 用户侧写库，实现“所想即所圈”。</p>
          </div>
          {step === "done" && (
            <Button variant="outline" onClick={handleReset}>开启新任务</Button>
          )}
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          
            {/* 模块一：AI 意图探究台 */}
            <Card className={`border-2 transition-all ${step === "input" ? "border-blue-500 shadow-md" : "border-transparent opacity-80"}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">1</span>
                  输入人群意图
                </CardTitle>
                <CardDescription>使用自然语言描述您想要寻找的目标人群</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="例如：六一亲子游出行意图人群..."
                  className="min-h-[100px] text-base resize-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={step !== "input"}
                />
                {step === "input" && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 flex items-center mr-2">Prompt 推荐:</span>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200" onClick={() => setQuery("六一亲子游出行意图人群")}>
                      六一亲子游出行
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200" onClick={() => setQuery("近期想买新能源车且注重家庭出行的中年男性")}>
                      新能源家庭购车
                    </Badge>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-slate-200" onClick={() => setQuery("喜欢看美妆护肤评测的年轻女性")}>
                      美妆护肤受众
                    </Badge>
                  </div>
                )}
              </CardContent>
              {step === "input" && (
                <CardFooter className="justify-end">
                  <Button onClick={handleParse} className="gap-2">
                    <Search className="w-4 h-4" />
                    解析意图
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* 解析 Loading 态 */}
            {step === "parsing" && (
              <Card className="border-blue-200 bg-blue-50/50 animate-pulse">
                <CardContent className="py-8 flex flex-col items-center justify-center text-blue-600">
                  <Sparkles className="w-8 h-8 animate-spin mb-4" />
                  <p className="font-medium">大模型正在进行硬属性与软语义拆解...</p>
                </CardContent>
              </Card>
            )}

            {/* 模块二：规则白盒化与微调面板 */}
            {(step === "tweaking" || step === "preview" || step === "export" || step === "done") && (
              <Card className={`border-2 transition-all ${step === "tweaking" ? "border-blue-500 shadow-md" : "border-transparent opacity-80"}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">2</span>
                    规则白盒化与微调
                  </CardTitle>
                  <CardDescription>确认大模型解析的条件，您可手动干预修改以提高精准度</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* 硬条件区 */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      硬性属性 (Hard Conditions) - 漏斗过滤
                    </h3>
                    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                      {hardConditions.map(cond => (
                        <Badge key={cond.id} variant="outline" className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 flex items-center gap-1 border-slate-300">
                          <span className="text-slate-500">{cond.key}:</span>
                          {step === "tweaking" ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="font-medium cursor-pointer hover:text-blue-600 transition-colors underline decoration-dashed decoration-slate-300 underline-offset-4 outline-none">
                                {cond.value}
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="min-w-[120px]">
                                {getConditionOptions(cond.key).map(opt => (
                                  <DropdownMenuItem 
                                    key={opt} 
                                    onClick={() => handleUpdateConditionValue(cond.id, opt)}
                                    className={cond.value === opt ? "bg-blue-50 text-blue-600 font-medium" : ""}
                                  >
                                    {opt}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <span className="font-medium">{cond.value}</span>
                          )}
                          {step === "tweaking" && (
                            <X className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500" onClick={() => handleRemoveCondition(cond.id)} />
                          )}
                        </Badge>
                      ))}
                      {step === "tweaking" && !isAddingCondition && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 border border-dashed border-slate-300 gap-1 text-slate-500"
                          onClick={() => setIsAddingCondition(true)}
                        >
                          <Plus className="w-3 h-3" /> 添加条件
                        </Button>
                      )}
                      {step === "tweaking" && isAddingCondition && (
                        <div className="flex items-center gap-2 p-1.5 border border-dashed border-blue-300 bg-blue-50 dark:bg-blue-950/30 rounded-md animate-in fade-in zoom-in duration-200 flex-wrap">
                          <span className="text-xs text-blue-500 ml-1">选择标签:</span>
                          {["性别", "年龄", "城市等级", "消费力", "活跃时段", "设备价格", "设备品牌", "婚恋状态", "职业", "兴趣偏好"].map(tag => {
                            const isAdded = hardConditions.some(c => c.key === tag);
                            return (
                              <Badge 
                                key={tag} 
                                variant={isAdded ? "secondary" : "outline"}
                                className={`
                                  ${isAdded 
                                    ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-transparent dark:bg-slate-800 dark:text-slate-500" 
                                    : "cursor-pointer bg-white dark:bg-slate-900 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                                  }
                                `}
                                onClick={() => {
                                  if (!isAdded) handleAddNewCondition(tag);
                                }}
                              >
                                {tag}
                              </Badge>
                            );
                          })}
                          <X 
                            className="w-3.5 h-3.5 ml-1 text-slate-400 cursor-pointer hover:text-slate-700" 
                            onClick={() => setIsAddingCondition(false)} 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* 软语义区 */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      软性语义 (Soft Intents) - 向量检索匹配
                    </h3>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-100 dark:border-purple-900 group relative">
                      {isEditingIntent ? (
                        <div className="space-y-3">
                          <Textarea 
                            value={softIntent}
                            onChange={(e) => setSoftIntent(e.target.value)}
                            className="min-h-[100px] text-sm text-purple-900 dark:text-purple-200 border-purple-300 focus-visible:ring-purple-500 bg-white/80 dark:bg-slate-900/80"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsEditingIntent(false)} className="h-8">取消</Button>
                            <Button size="sm" onClick={() => setIsEditingIntent(false)} className="h-8 bg-purple-600 hover:bg-purple-700">确认修改</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed pr-8">
                            "{softIntent}"
                          </p>
                          {step === "tweaking" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute top-0 right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 hover:text-purple-700 hover:bg-purple-100/50"
                              onClick={() => setIsEditingIntent(true)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 px-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">语义匹配严格度 (相似度阈值)</span>
                        <span className="font-medium text-blue-600">{Array.isArray(strictness) ? strictness[0] : strictness}%</span>
                      </div>
                      <Slider 
                        value={strictness} 
                        onValueChange={(val) => setStrictness(Array.isArray(val) ? val : [val as number])} 
                        max={100} 
                        min={50} 
                        step={1}
                        disabled={step !== "tweaking"}
                        className="py-2"
                      />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>人群规模更大</span>
                        <span>匹配度更精准</span>
                      </div>
                    </div>
                  </div>

                </CardContent>
                {step === "tweaking" && (
                  <CardFooter className="justify-between">
                    <Button variant="outline" onClick={handleBack}>返回上一步</Button>
                    <Button onClick={handleEstimate} className="gap-2 bg-slate-900 hover:bg-slate-800">
                      进行双路检索与规模预估 <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}

            {/* 模块三：规模预估与抽样 */}
            {(step === "preview" || step === "export" || step === "done") && (
              <Card className={`border-2 transition-all ${step === "preview" ? "border-blue-500 shadow-md" : "border-transparent opacity-80"}`}>
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">3</span>
                    预估规模与抽样
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {isEstimating ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <Sparkles className="w-10 h-10 animate-spin text-blue-600 relative z-10" />
                      </div>
                      <div className="space-y-2 text-center">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">正在进行双路检索与向量匹配...</p>
                        <p className="text-xs text-slate-500">正在从 10 亿+ 用户池中召回符合条件的受众</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* 规模数字 */}
                  <div className="text-center space-y-1">
                    <p className="text-sm text-slate-500">预计覆盖 UV</p>
                    {estimatedSize === null ? (
                      <div className="h-10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 animate-spin text-slate-300" />
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {(estimatedSize / 10000).toFixed(1)} <span className="text-xl font-medium text-slate-500">万人</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* 抽样卡片 */}
                  {estimatedSize !== null && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">AI 画像抽样反馈 (RLHF)</p>
                      
                      {profiles.map(profile => (
                        <div key={profile.id} className="bg-white dark:bg-slate-950 border rounded-lg p-4 space-y-3 shadow-sm relative overflow-hidden text-left w-full">
                          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold">{profile.name} <span className="text-xs font-normal text-slate-500 ml-1">{profile.location} · {profile.age}岁 · {profile.gender} · {profile.cityLevel || '新一线'}</span></p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {profile.description}
                          </p>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200">
                              <ThumbsUp className="w-3 h-3" /> 精准
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 gap-1 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setRejectProfileId(profile.id)}
                            >
                              <ThumbsDown className="w-3 h-3" /> 偏差
                            </Button>
                          </div>
                        </div>
                      ))}

                    </div>
                  )}
                    </>
                  )}
                </CardContent>
                {step === "preview" && !isEstimating && estimatedSize !== null && (
                  <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t pt-4 flex-row gap-4">
                    <Button variant="outline" className="flex-1" onClick={handleBack}>返回上一步</Button>
                    <Button className="flex-[2] gap-2" onClick={handleExport}>
                      确认无误，去生成人群包 <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}

            {/* 模块四：人群包输出与流转 */}
            {(step === "export" || step === "done") && (
              <Card className={`border-2 transition-all ${step === "export" ? "border-green-500 shadow-md" : "border-transparent opacity-80"}`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold">4</span>
                    人群包输出
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">人群包名称</label>
                    <Input 
                      value={audienceName} 
                      onChange={e => setAudienceName(e.target.value)}
                      disabled={step === "done"}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">同步目标系统</label>
                      <div className="flex gap-2">
                        <Badge 
                          variant={targetSystems.includes("发奖计划") ? "default" : "outline"} 
                          className={`cursor-pointer py-1.5 transition-colors ${targetSystems.includes("发奖计划") && step !== "done" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                          onClick={() => toggleTargetSystem("发奖计划")}
                        >
                          发奖计划
                        </Badge>
                        <Badge 
                          variant={targetSystems.includes("营销策略") ? "default" : "outline"} 
                          className={`cursor-pointer py-1.5 transition-colors ${targetSystems.includes("营销策略") && step !== "done" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                          onClick={() => toggleTargetSystem("营销策略")}
                        >
                          营销策略
                        </Badge>
                      </div>
                    </div>

                    {/* 发奖计划 展开输入框 */}
                    {targetSystems.includes("发奖计划") && (
                      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-md border animate-in slide-in-from-top-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">生效的发奖计划 (支持多选)</label>
                          <div className="flex flex-col gap-2">
                            <div className="min-h-10 p-1.5 border rounded-md bg-white dark:bg-slate-950 flex flex-wrap gap-1.5 items-center">
                              {/* 已选发奖计划回显 */}
                              <Badge variant="secondary" className="h-6 flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                <span className="text-[10px] opacity-70">ID:1024</span>
                                六一拉新大促发奖
                                {step !== "done" && <X className="w-3 h-3 ml-0.5 cursor-pointer" />}
                              </Badge>
                              <Badge variant="secondary" className="h-6 flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                <span className="text-[10px] opacity-70">ID:1025</span>
                                亲子游召回礼包
                                {step !== "done" && <X className="w-3 h-3 ml-0.5 cursor-pointer" />}
                              </Badge>
                              {/* 模拟输入光标 */}
                              {step !== "done" && (
                                <input 
                                  className="flex-1 min-w-[120px] outline-none text-sm bg-transparent px-1 placeholder:text-slate-400" 
                                  placeholder="搜索计划 ID 或名称..."
                                />
                              )}
                            </div>
                            {step !== "done" && (
                              <p className="text-[10px] text-slate-400">输入关键词或ID从系统中拉取匹配项进行关联</p>
                            )}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between items-center">
                            <label className="text-xs font-medium text-slate-500">人群生效时间</label>
                            {step === "done" ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{rewardValidityType}</span>
                                {rewardValidityType === "自定义" && customDateRange && (
                                  <span className="text-xs text-slate-500">({format(customDateRange, "yyyy-MM-dd", { locale: zhCN })})</span>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors underline decoration-dashed decoration-slate-300 underline-offset-4 outline-none">
                                    {rewardValidityType}
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="min-w-[120px]">
                                    {["自定义", "与发奖计划对齐"].map(opt => (
                                      <DropdownMenuItem 
                                        key={opt} 
                                        onClick={() => setRewardValidityType(opt)}
                                        className={rewardValidityType === opt ? "bg-blue-50 text-blue-600 font-medium" : ""}
                                      >
                                        {opt}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                {rewardValidityType === "自定义" && (
                                  <Popover>
                                    <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 text-xs px-2 py-0">
                                      {customDateRange ? format(customDateRange, "yyyy-MM-dd", { locale: zhCN }) : "选择日期"}
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                      <Calendar
                                        mode="single"
                                        selected={customDateRange}
                                        onSelect={setCustomDateRange}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 营销策略 展开配置 */}
                    {targetSystems.includes("营销策略") && (
                      <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-md border animate-in slide-in-from-top-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-slate-500">人群生效时间</label>
                          {step === "done" ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{marketingValidity}</span>
                              {marketingValidity === "自定义时间段" && marketingCustomDateRange && (
                                <span className="text-xs text-slate-500">({format(marketingCustomDateRange, "yyyy-MM-dd", { locale: zhCN })})</span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger className="text-sm font-medium cursor-pointer hover:text-blue-600 transition-colors underline decoration-dashed decoration-slate-300 underline-offset-4 outline-none">
                                  {marketingValidity}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="min-w-[120px]">
                                  {["永久有效", "近7天有效", "近30天有效", "自定义时间段"].map(opt => (
                                    <DropdownMenuItem 
                                      key={opt} 
                                      onClick={() => setMarketingValidity(opt)}
                                      className={marketingValidity === opt ? "bg-blue-50 text-blue-600 font-medium" : ""}
                                    >
                                      {opt}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              {marketingValidity === "自定义时间段" && (
                                <Popover>
                                  <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-6 text-xs px-2 py-0">
                                    {marketingCustomDateRange ? format(marketingCustomDateRange, "yyyy-MM-dd", { locale: zhCN }) : "选择日期"}
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                      mode="single"
                                      selected={marketingCustomDateRange}
                                      onSelect={setMarketingCustomDateRange}
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          )}
                        </div>
                        {step !== "done" && (
                          <p className="text-[10px] text-slate-400">选择永久有效时，人群包将持续更新并推流至营销平台</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
                {step === "export" && (
                  <CardFooter className="flex-row gap-4">
                    <Button variant="outline" className="flex-1" onClick={handleBack}>返回上一步</Button>
                    <Button className="flex-[2] gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={handleFinish}>
                      <Save className="w-4 h-4" /> 保存并同步
                    </Button>
                  </CardFooter>
                )}
                {step === "done" && (
                  <CardFooter className="flex-col gap-4">
                    <div className="w-full p-3 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5" />
                      人群包已成功生成并推流！
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleBack}>返回上一步 (重新导出)</Button>
                  </CardFooter>
                )}
              </Card>
            )}

        </div>
      </div>

      <AlertDialog open={!!rejectProfileId} onOpenChange={(open) => !open && setRejectProfileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认标记该用户为偏差？</AlertDialogTitle>
            <AlertDialogDescription>
              是否将该用户移出人群包，并被打标为负向人群给到 Agent 学习？<br />
              确认后，系统将调整输出用户量级并刷新预测结果。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReject} className="bg-red-600 hover:bg-red-700">
              确认移除并学习
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
