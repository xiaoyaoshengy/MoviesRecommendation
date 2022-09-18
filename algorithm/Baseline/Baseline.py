"""
Baseline 推荐算法
"""
import pandas as pd
import sys
import os

# 脚本路径
path = os.path.split(os.path.realpath(__file__))
# 电影数据
movies = pd.read_csv(path + '/../database/movies.csv')
# 评分数据
ratings = pd.read_csv(path + '/../database/ratings.csv')
# 用户偏置
bu = pd.read_csv(path + '/bu.csv')
# 物品偏置
bi = pd.read_csv(path + '/bi.csv')
# 待推荐用户
user_md5 = sys.argv[1]

# 推荐
# 用户观影历史
history = ratings[ratings['USER_MD5'] == user_md5].values
# 存储用户预测评分
user_prediction = []
# 用户偏置值
user_bias = bu[bu['USER_MD5'] == user_md5]['BIAS'].values[0]
# 全局平均分
global_mean = ratings['RATING'].mean()
# 预测
for i in range(len(bi)):
    if bi.loc[i, 'MOVIE_ID'] in history:
        continue
    user_prediction.append([bi.loc[i, 'MOVIE_ID'], global_mean + user_bias + bi.loc[i, 'BIAS']])
# 数据整理
user_prediction = pd.DataFrame(user_prediction, columns=['MOVIE_ID', 'RATING'])
user_prediction = user_prediction.sort_values(by='RATING', ascending=False)
# 推荐前 100 部电影
recommend_movies = user_prediction.iloc[:100]['MOVIE_ID'].values
# 获取推荐电影信息
movies.set_index('MOVIE_ID', inplace=True)
recommend_movies_info = movies.loc[list(set(recommend_movies.tolist()) & set(movies.index))]
recommend_movies_info = recommend_movies_info.reindex(recommend_movies)
# 保存到文件
recommend_movies_info.to_csv(path + '/' + user_md5 + '.csv', index=False)
